var User          = require('./models/user'),
    ContactLogic  = require('../processContact'),
    Contact       = require('./models/contact.js'),
    Transaction   = require('./models/transaction.js'),
    Testimonial   = require('./models/testimonial.js'),
    Entities      = require('./models/entities.js'),
    Meta      = require('./models/meta.js'),
    async         = require("async"),
    formidable    = require('formidable'),
    util          = require('util')
    fs            = require('fs-extra'),
    nodemailer    = require('nodemailer');

module.exports = function(app, passport) {


    app.use(function (req, res, next) {
        console.log('Time:', Date.now());
        Meta.find({}, function(err, meta) {
            if (err) {
                throw err;
            } else {
                req.meta = meta[0]
                next();
            }
        })
    });


    app.get('/', function (req, res) {
        res.render('home.html',
            {
                meta: req.meta
            });
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


        // var transporter = nodemailer.createTransport("SMTP", {
        //     service: "hotmail",
        //     auth: {
        //         user: "Escrow@scountymtg.com",
        //         pass: "Scout138"
        //     }
        // });

        var transporter = nodemailer.createTransport("SMTP", {
            host: "smtp-mail.outlook.com", // hostname
            secureConnection: false, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            auth: {
                user: "Escrow@scountymtg.com",
                pass: "Scout138"
            },
            tls: {
                ciphers:'SSLv3'
            }
        });

        var mailOptions = {
            from: 'County Mortgage Website',
            to: 'sktank16@gmail.com',
            subject: 'County Mortgage Website Message From ' + name,
            html: '<br><b>Name: </b>' + name + '<br><b>Email or Phone: </b>' + email + '<br><br>' + message, // html body
            text: name + "; " + email + "; " + message
        };

        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
                req.flash('errorMessage', 'Message failed to submit. Please email us directly');
                returnForm(false)
                return false;
            } else{
                console.log('Message sent');
                returnForm(true);
                }
        });

        //var contact            = new Contact();
        // // set the user's local credentials
        // contact.name           = name;
        // contact.email          = email;
        // contact.message        = message;
        // contact.time           = now;
        // contact.archived       = false;
        // // save the user
        // contact.save(function(err) {
        //     if (err)
        //         throw err;
        //     console.log('user should be saved!');
        //     returnForm(true)
        // });

        function returnForm(ret) {
            console.log(ret);
            if (!ret) {
                name = req.body.name || '';
                email = req.body.email || '';
                message = req.body.message || '';
            } else {
                name = '';
                email = '';
                message = '';
                req.flash('successMessage', 'Message sent!');
            }

            res.render('contact.html', 
            {
                errorMessage: req.flash('errorMessage'),
                successMessage: req.flash('successMessage'),
                name : name,
                email : email,
                message : message,
                meta : req.meta
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
            img        = form.imgName,
            position   = form.position;
            thheight   = form.thheight;
            thwidth    = form.thwidth;

        var transaction            = new Transaction();
        transaction.name           = name;
        transaction.address        = address;
        transaction.img            = img;
        transaction.position       = position;
        transaction.thheight       = thheight;
        transaction.thwidth        = thwidth;

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
        form.thheight = form.thheightTemp;
        form.thwidth = form.thwidthTemp;
        delete form.nameTemp;
        delete form.addTemp;
        delete form.monTemp;
        delete form.positionTemp;
        delete form.thheightTemp;
        delete form.thwidthTemp;
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
    //                          Entities                          //
    ////////////////////////////////////////////////////////////////

    app.get('/api/entities/:type', function(req, res) {

        Entities.find({type: req.params.type}, function(err, entities) {
            if (err) {
                throw err;
            } else {
                res.json(entities);
            }
        })
    })

    app.post('/api/entities/save', function (req, res) {
        var obj = req.body;
        var id = obj.id;
        console.log(obj)
        console.log(id)
        delete obj.id;
        if (id) {
            Entities.findByIdAndUpdate(id, obj, function (err, model) {
                if (err)
                    throw err;
                console.log('entity should be updated!');
                res.json(model);
            })
        } else {
            var entities_model = new Entities(obj)
            entities_model.save(function(err, model){
            if (err)
                    throw err;
                console.log('entity should be updated!');
                res.json(model);
        })
        }
    })


    app.get('/api/meta', function(req, res) {
        Meta.find({}, function(err, entities) {
            if (err) {
                throw err;
            } else {
                res.json(entities);
            }
        })
    })


    app.post('/api/meta/save', function (req, res) {
        var obj = req.body;
        var id = obj.id;
        console.log(obj)
        console.log(id)
        delete obj.id;
        if (id) {
            Meta.findByIdAndUpdate(id, obj, function (err, model) {
                if (err)
                    throw err;
                console.log('entity should be updated!');
                res.json(model);
            })
        } else {
            var entities_model = new Meta(obj)
            entities_model.save(function(err, model){
            if (err)
                    throw err;
                console.log('entity should be updated!');
                res.json(model);
        })
    }

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




    // app.get('/loan-criteria#residential', function (req, res) {
    //     res.render('criteria.html');
    // });

        // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('login.html', { message: req.flash('loginMessage'), meta : req.meta });
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
    app.get('/signup', isLoggedIn, function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.html', { message: req.flash('signupMessage'), meta : req.meta });
    });

    // process the signup form
    app.post('/signup', isLoggedIn, passport.authenticate('local-signup', {
        successRedirect : '/admin', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    app.get('/admin', isLoggedIn, function(req, res) {
        var user = req.user;

        // get all the contact message

        Contact.find({}, function(err, contacts) {
            if (err) {
                console.log("shit");
            } else {
                console.log(contacts);
                res.render('admin.html', {contacts: contacts, meta : req.meta});
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
                res.render('transactions.html', {transactions: transactions, meta : req.meta});
            }
        })
    })


    app.get('/contact', function (req, res) {
        res.render('contact.html', {meta : req.meta});
    });


    app.get('/about', function (req, res) {
        Entities.find({type: 'about'}, function(err, entities) {
            if (err) {
                throw err;
            } else {
                console.log(entities[0].list);
                res.render('about.html',
                {
                    entities: entities[0].list,
                    meta : req.meta
                })
            }
        })
    });

    app.get('/team', function (req, res) {
        Entities.find({type: 'team'}, function(err, entities) {
            if (err) {
                throw err;
            } else {
                console.log(entities[0].list);
                res.render('team.html',
                {
                    entities: entities[0].list,
                    meta : req.meta
                })
            }
        })
    });

    app.get('/loan-criteria', function (req, res) {
        Entities.find({type: 'investment'}, function(err, investment) {
            if (err) {
                throw err;
            } else {
                Entities.find({type: 'residential'}, function(err, residential) {
                    if (err) {
                        throw err;
                    } else {
                        res.render('criteria.html',
                        {
                            investment: investment[0].list,
                            residential: residential[0].list,
                            meta : req.meta
                        })
                    }
                })
            }
        })
    });

    app.get('/owner-occupied', function (req, res) {
        Entities.find({type: 'owner'}, function(err, entities) {
            if (err) {
                throw err;
            } else {
                console.log(entities[0].list);
                res.render('owner-occupied.html',
                {
                    entities: entities[0].list,
                    meta : req.meta
                })
            }
        })
    });

    app.get('/commercial', function (req, res) {
        Entities.find({type: 'commercial'}, function(err, entities) {
            if (err) {
                throw err;
            } else {
                console.log(entities[0].list);
                res.render('commercial.html',
                {
                    entities: entities[0].list,
                    meta : req.meta
                })
            }
        })
    });

    app.get('/construction', function (req, res) {
        Entities.find({type: 'construction'}, function(err, entities) {
            if (err) {
                throw err;
            } else {
                console.log(entities[0].list);
                res.render('construction.html',
                {
                    entities: entities[0].list,
                    meta : req.meta
                })
            }
        })
    });

    app.get('/glossary', function (req, res) {
        Entities.find({type: 'glossaryquestions'}, function(err, questions) {
            if (err) {
                throw err;
            } else {
                Entities.find({type: 'glossaryterms'}, function(err, terms) {
                    if (err) {
                        throw err;
                    } else {
                        res.render('glossary.html',
                        {
                            questions: questions[0].list,
                            terms: terms[0].list,
                            meta : req.meta
                        })
                    }
                })
            }
        })
    });

    app.get('/servicing-disclosure', function (req, res) {
        res.render('servicing-disclosure.html', {meta : req.meta});
    });

    app.get('/appraisers-list', function (req, res) {
        Entities.find({type: 'appraisers'}, function(err, entities) {
            if (err) {
                throw err;
            } else {
                console.log(entities[0].list);
                res.render('appraisers-list.html',
                {
                    entities: entities[0].list,
                    meta : req.meta
                })
            }
        })
    });

    app.get('/closing-lawyers', function (req, res) {
        Entities.find({type: 'lawyers'}, function(err, entities) {
            if (err) {
                throw err;
            } else {
                console.log(entities[0].list);
                res.render('closing-lawyers.html',
                {
                    entities: entities[0].list,
                    meta : req.meta
                })
            }
        })
    });

    app.get('/credit-bureau', function (req, res) {
        Entities.find({type: 'credit'}, function(err, entities) {
            if (err) {
                throw err;
            } else {
                console.log(entities[0].list);
                res.render('credit-bureau.html',
                {
                    entities: entities[0].list,
                    meta : req.meta
                })
            }
        })
    });

    app.get('/mass-buyer-info', function (req, res) {
        Entities.find({type: 'massgov'}, function(err, entities) {
            if (err) {
                throw err;
            } else {
                console.log(entities[0].list);
                res.render('mass-buyer-info.html',
                {
                    entities: entities[0].list,
                    meta : req.meta
                })
            }
        })
    });

    app.get('/counselors', function (req, res) {
        res.render('counselors.html', {meta : req.meta});
    });

    app.get('/privacy-policy', function (req, res) {
        res.render('privacy.html', {meta : req.meta});
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
	