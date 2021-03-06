import os, shutil, tempfile
from contextlib import contextmanager
from libmproxy import flow, utils, controller
if os.name != "nt":
    from libmproxy.console.flowview import FlowView
    from libmproxy.console import ConsoleState
from netlib import certutils
from nose.plugins.skip import SkipTest
from mock import Mock

def _SkipWindows():
    raise SkipTest("Skipped on Windows.")
def SkipWindows(fn):
    if os.name == "nt":
        return _SkipWindows
    else:
        return fn

def treq(conn=None, content="content"):
    if not conn:
        conn = flow.ClientConnect(("address", 22))
    conn.reply = controller.DummyReply()
    headers = flow.ODictCaseless()
    headers["header"] = ["qvalue"]
    r = flow.Request(conn, (1, 1), "host", 80, "http", "GET", "/path", headers,
            content)
    r.reply = controller.DummyReply()
    return r


def tresp(req=None):
    if not req:
        req = treq()
    headers = flow.ODictCaseless()
    headers["header_response"] = ["svalue"]
    cert = certutils.SSLCert.from_der(file(test_data.path("data/dercert"),"rb").read())
    resp = flow.Response(req, (1, 1), 200, "message", headers, "content_response", cert)
    resp.reply = controller.DummyReply()
    return resp

def terr(req=None):
    if not req:
        req = treq()
    err = flow.Error(req, "error")
    err.reply = controller.DummyReply()
    return err


def tflow(r=None):
    if r == None:
        r = treq()
    return flow.Flow(r)


def tflow_full():
    f = tflow()
    f.response = tresp(f.request)
    return f


def tflow_err():
    f = tflow()
    f.error = terr(f.request)
    return f

def tflowview(request_contents=None):
    m = Mock()
    cs = ConsoleState()
    if request_contents == None:
        flow = tflow()
    else:
        req = treq(None, request_contents)
        flow = tflow(req)

    fv = FlowView(m, cs, flow)
    return fv

def get_body_line(last_displayed_body, line_nb):
    return last_displayed_body.contents()[line_nb + 2]

@contextmanager
def tmpdir(*args, **kwargs):
    orig_workdir = os.getcwd()
    temp_workdir = tempfile.mkdtemp(*args, **kwargs)
    os.chdir(temp_workdir)

    yield temp_workdir

    os.chdir(orig_workdir)
    shutil.rmtree(temp_workdir)


def raises(exc, obj, *args, **kwargs):
    """
        Assert that a callable raises a specified exception.

        :exc An exception class or a string. If a class, assert that an
        exception of this type is raised. If a string, assert that the string
        occurs in the string representation of the exception, based on a
        case-insenstivie match.

        :obj A callable object.

        :args Arguments to be passsed to the callable.

        :kwargs Arguments to be passed to the callable.
    """
    try:
        apply(obj, args, kwargs)
    except Exception, v:
        if isinstance(exc, basestring):
            if exc.lower() in str(v).lower():
                return
            else:
                raise AssertionError(
                    "Expected %s, but caught %s"%(
                        repr(str(exc)), v
                    )
                )
        else:
            if isinstance(v, exc):
                return
            else:
                raise AssertionError(
                    "Expected %s, but caught %s %s"%(
                        exc.__name__, v.__class__.__name__, str(v)
                    )
                )
    raise AssertionError("No exception raised.")

test_data = utils.Data(__name__)
