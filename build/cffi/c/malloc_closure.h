/*
 * This file is from CPython's Modules/_ctypes/malloc_closure.c
 * and has received some edits.
 */

#include <ffi.h>
#ifdef MS_WIN32
#include <windows.h>
#else
#include <sys/mman.h>
#include <unistd.h>
# if !defined(MAP_ANONYMOUS) && defined(MAP_ANON)
#  define MAP_ANONYMOUS MAP_ANON
# endif
#endif

/* 'allocate_num_pages' is dynamically adjusted starting from one
   page.  It grows by a factor of PAGE_ALLOCATION_GROWTH_RATE.  This is
   meant to handle both the common case of not needing a lot of pages,
   and the rare case of needing many of them.  Systems in general have a
   limit of how many mmap'd blocks can be open.
*/

#define PAGE_ALLOCATION_GROWTH_RATE  1.3

static Py_ssize_t allocate_num_pages = 0;

/* #define MALLOC_CLOSURE_DEBUG */ /* enable for some debugging output */

/******************************************************************/

union mmaped_block {
    ffi_closure closure;
    union mmaped_block *next;
};

static union mmaped_block *free_list = 0;
static Py_ssize_t _pagesize = 0;

static void more_core(void)
{
    union mmaped_block *item;
    Py_ssize_t count, i;

/* determine the pagesize */
#ifdef MS_WIN32
    if (!_pagesize) {
        SYSTEM_INFO systeminfo;
        GetSystemInfo(&systeminfo);
        _pagesize = systeminfo.dwPageSize;
    }
#else
    if (!_pagesize) {
#ifdef _SC_PAGESIZE
        _pagesize = sysconf(_SC_PAGESIZE);
#else
        _pagesize = getpagesize();
#endif
    }
#endif
    if (_pagesize <= 0)
        _pagesize = 4096;

    /* bump 'allocate_num_pages' */
    allocate_num_pages = 1 + (
        (Py_ssize_t)(allocate_num_pages * PAGE_ALLOCATION_GROWTH_RATE));

    /* calculate the number of mmaped_blocks to allocate */
    count = (allocate_num_pages * _pagesize) / sizeof(union mmaped_block);

    /* allocate a memory block */
#ifdef MS_WIN32
    item = (union mmaped_block *)VirtualAlloc(NULL,
                                           count * sizeof(union mmaped_block),
                                           MEM_COMMIT,
                                           PAGE_EXECUTE_READWRITE);
    if (item == NULL)
        return;
#else
    item = (union mmaped_block *)mmap(NULL,
                        allocate_num_pages * _pagesize,
                        PROT_READ | PROT_WRITE | PROT_EXEC,
                        MAP_PRIVATE | MAP_ANONYMOUS,
                        -1,
                        0);
    if (item == (void *)MAP_FAILED)
        return;
#endif

#ifdef MALLOC_CLOSURE_DEBUG
    printf("block at %p allocated (%ld bytes), %ld mmaped_blocks\n",
           item, (long)(allocate_num_pages * _pagesize), (long)count);
#endif
    /* put them into the free list */
    for (i = 0; i < count; ++i) {
        item->next = free_list;
        free_list = item;
        ++item;
    }
}

/******************************************************************/

/* put the item back into the free list */
static void cffi_closure_free(ffi_closure *p)
{
    union mmaped_block *item = (union mmaped_block *)p;
    item->next = free_list;
    free_list = item;
}

/* return one item from the free list, allocating more if needed */
static ffi_closure *cffi_closure_alloc(void)
{
    union mmaped_block *item;
    if (!free_list)
        more_core();
    if (!free_list)
        return NULL;
    item = free_list;
    free_list = item->next;
    return &item->closure;
}
