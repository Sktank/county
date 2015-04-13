var User          = require('./models/user'),
    ContactLogic  = require('../processContact'),
    Contact       = require('./models/contact.js'),
    Transaction   = require('./models/transaction.js'),
    Testimonial   = require('./models/testimonial.js'),
    async         = require("async"),
    formidable    = require('formidable'),
    util          = require('util')
    fs            = require('fs-extra');

module.exports = function(app, passport) {

    app.get('/', function (req, res) {
        res.render('home.html');
    });



    app.post('/contact', function (req, res) {
        // validate form
        // res.render('login.html', { message: req.flash('loginMessage') });
        var name = '',
            email = '',
            message = '';

        // Call an asynchronous function, often a save() to DB
        var form = req.body;
        // get the fields
        var name = form.name,
            email = form.email,
            message = form.message;

        console.log(name);
        console.log(email);
        console.log(message);

        if (!name) {
            req.flash('errorMessage', 'Name required');
            returnForm(false)
            return false;
        }
        if (!email) {
            req.flash('errorMessage', 'Email required');
            returnForm(false)
            return false;
        }
        if (!message) {
            req.flash('errorMessage', 'Message required');
            returnForm(false)
            return false;
        }

        var date = new Date();
        var now = date.getTime();

        var contact            = new Contact();

        // set the user's local credentials
        contact.name           = name;
        contact.email          = email;
        contact.message        = message;
        contact.time           = now;
        contact.archived       = false;
        // save the user
        contact.save(function(err) {
            if (err)
                throw err;
            console.log('user should be saved!');
            returnForm(true)
        });

        function returnForm(ret) {
            console.log(ret);
            if (!ret) {
                name = req.body.name || '';
                email = req.body.email || '';
                message = req.body.message || '';
            } else {
                req.flash('successMessage', 'Message sent!');
            }

            res.render('contact.html', 
            {
                errorMessage: req.flash('errorMessage'),
                successMessage: req.flash('successMessage'),
                name : name,
                email : email,
                message : message
            });
        }
    });


    ////////////////////////////////////////////////////////////////
    //                          Transactions                      //
    ////////////////////////////////////////////////////////////////

    app.post('/api/transaction/uploadImage', function (req, res) {
        console.log("uploaded form");
        var date;
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            res.writeHead(200, {'content-type': 'text/plain'});
            res.write('received upload:\n\n');
            date = fields.date;
            res.end(util.inspect({fields: fields, files: files}));
        });

        form.on('end', function(fields, files) {
            /* Temporary location of our uploaded file */
            var temp_path = this.openedFiles[0].path;
            /* The file name of the uploaded file */
            var file_name = date + '-' + this.openedFiles[0].name;
            /* Location where we want to copy the uploaded file */
            var new_location = 'uploads/';
            console.log("about to save");
            fs.copy(temp_path, new_location + file_name, function(err) {  
              if (err) {
                console.error(err);
              } else {
                console.log("success!")
              }
            });
          });
    })


    app.post('/api/transaction/create', function (req, res) {
        var form = req.body;
        console.log(form);
        // get the fields
        var name       = form.name,
            address    = form.address,
            money      = form.money,
            img        = form.imgName,
            position   = form.position;

        var transaction            = new Transaction();
        transaction.name           = name;
        transaction.address        = address;
        transaction.money          = money;
        transaction.img            = img;
        transaction.position       = position;

        transaction.save(function(err, model) {
            if (err)
                throw err;
            console.log('transaction should be saved!');
            res.json(model);
        });
    })

    app.post('/api/transaction/delete', function (req, res) {
        var form = req.body;
        // get the fields
        console.log(form);
        console.log(form._id);
        Transaction.findByIdAndRemove(form._id, function(err, model) {
            if (err)
                throw err;
            console.log('transaction should be deleted!');
            fs.unlink('uploads/' + form.img);
            res.json(model);
        })
    })

    app.post('/api/transaction/update', function (req, res) {
        var form = req.body;
        form.name = form.nameTemp;
        form.address = form.addTemp;
        form.money = form.monTemp;
        form.position = form.positionTemp;
        delete form.nameTemp;
        delete form.addTemp;
        delete form.monTemp;
        delete form.positionTemp;
        // get the fields
        console.log(form);
        console.log(form._id);
        var id = form._id;
        delete form._id;
        Transaction.findByIdAndUpdate(id, form, function(err, model) {
            if (err)
                throw err;
            console.log('transaction should be updated!');
            res.json(model);
        })
    })


    ////////////////////////////////////////////////////////////////
    //                          Testimonials                      //
    ////////////////////////////////////////////////////////////////

    app.post('/api/testimonial/create', function (req, res) {
        var form = req.body;
        console.log(form);
        // get the fields
        var name = form.name,
            quote = form.quote,
            type = form.type,
            position = form.position;


        var testimonial            = new Testimonial();
        testimonial.name           = name;
        testimonial.quote          = quote;
        testimonial.type           = type;
        testimonial.position       = position;

        testimonial.save(function(err, model) {
            if (err)
                throw err;
            console.log('testimonial should be saved!');
            res.json(model);
        });
    })

    app.post('/api/testimonial/delete', function (req, res) {
        var form = req.body;
        // get the fields
        console.log(form);
        console.log(form._id);
        Testimonial.findByIdAndRemove(form._id, function(err, model) {
            if (err)
                throw err;
            console.log('testimonial should be deleted!');
            res.json(model);
        })
    })

    app.post('/api/testimonial/update', function (req, res) {
        var form = req.body;
        form.name = form.nameTemp;
        form.quote = form.quoteTemp;
        form.position = form.positionTemp;
        delete form.nameTemp;
        delete form.quoteTemp;
        delete form.positionTemp;
        // get the fields
        console.log(form);
        console.log(form._id);
        var id = form._id;
        delete form._id;
        Testimonial.findByIdAndUpdate(id, form, function(err, model) {
            if (err)
                throw err;
            console.log('testimonial should be updated!');
            res.json(model);
        })
    })


    app.post('/api/contact/toggleArchive', function (req, res) {
        var form = req.body;
        var id = form._id;
        delete form._id;
        Contact.findByIdAndUpdate(id, form, function(err, model) {
            if (err)
                throw err;
            console.log('testimonial should be updated!');
            res.json(model);
        })
    })


    app.post('/api/contact/delete', function (req, res) {
        var form = req.body;
        // get the fields
        console.log(form);
        console.log(form._id);
        Contact.findByIdAndRemove(form._id, function(err, model) {
            if (err)
                throw err;
            console.log('testimonial should be deleted!');
            res.json(model);
        })
    })


    app.get('/contact', function (req, res) {
        res.render('contact.html');
    });

    app.get('/brokers', function (req, res) {
        res.render('brokers.html');
    });

    app.get('/borrowers', function (req, res) {
        res.render('borrowers.html');
    });

    app.get('/about', function (req, res) {
        res.render('about.html');
    });

    app.get('/team', function (req, res) {
        res.render('team.html');
    });

    app.get('/loan-criteria', function (req, res) {
        res.render('criteria.html');
    });

    // app.get('/loan-criteria#residential', function (req, res) {
    //     res.render('criteria.html');
    // });

        // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.html', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/admin', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.html', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/admin', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/admin', function(req, res) {
        var user = req.user;

        // get all the contact message

        Contact.find({}, function(err, contacts) {
            if (err) {
                console.log("shit");
            } else {
                console.log(contacts);
                res.render('admin.html', {contacts: contacts});
            }
        })
    });

    app.get('/api/contacts', function(req, res) {
        Contact.find({}, function(err, contacts) {
            if (err) {
                throw err;
            } else {
                res.json({contacts: contacts});
            }
        })
    })

    app.get('/api/transactions', function(req, res) {
        Transaction.find({}, function(err, transactions) {
            if (err) {
                throw err;
            } else {
                res.json(transactions);
            }
        })
    })

    app.get('/api/testimonials/:type', function(req, res) {
        Testimonial.find({type: req.params.type}, function(err, testimonials) {
            if (err) {
                throw err;
            } else {
                res.json(testimonials);
            }
        })
    })

    function compareOrder(a,b) {
      if (a.position < b.position)
         return -1;
      if (a.position > b.position)
        return 1;
      return 0;
    }


    app.get('/transactions', function(req, res) {
        Transaction.find({}, function(err, transactions) {
            if (err) {
                throw err;
            } else {
                transactions.sort(compareOrder);
                res.render('transactions.html', {transactions: transactions});
            }
        })
    })

    app.get('/borrower-testimonials', function(req, res) {
        Testimonial.find({type:'borrower'}, function(err, testimonials) {
            if (err) {
                throw err;
            } else {
                testimonials.sort(compareOrder);
                res.render('testimonials.html', {testimonials: testimonials});
            }
        })
    })

    app.get('/broker-testimonials', function(req, res) {
        Testimonial.find({type:'broker'}, function(err, testimonials) {
            if (err) {
                throw err;
            } else {
                testimonials.sort(compareOrder);
                res.render('broker-testimonials.html', {testimonials: testimonials});
            }
        })
    })

    app.get('/owner-occupied', function (req, res) {
        res.render('owner-occupied.html');
    });

    app.get('/commercial', function (req, res) {
        res.render('commercial.html');
    });

    app.get('/construction', function (req, res) {
        res.render('construction.html');
    });

    app.get('/glossary', function (req, res) {
        res.render('glossary.html');
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


}   

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');

};
	