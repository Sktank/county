/**
 * Created with PyCharm.
 * User: spencertank
 * Date: 4/6/14
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */

// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var contactSchema = mongoose.Schema({

    name    : String,
    email   : String,
    message : String,


});


// create the model for users and expose it to our app
module.exports = mongoose.model('Contact', contactSchema);

