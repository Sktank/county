var Contact       = require('./app/models/contact.js');


exports.processForm = function(req) {

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
        return false;
    }
    if (!email) {
        req.flash('errorMessage', 'Email required');
        return false;
    }
    if (!message) {
        req.flash('errorMessage', 'Message required');
        return false;
    }

    var contact            = new Contact();

    // set the user's local credentials
    contact.name           = name;
    contact.email          = email;
    contact.message        = message;
    // save the user
    contact.save(function(err) {
        if (err)
            throw err;
        console.log('user should be saved!');
        return true;
    });

    // save form and return success
};