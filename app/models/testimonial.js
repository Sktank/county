
var mongoose = require('mongoose');

var testimonialSchema = mongoose.Schema({

    type    : String,
    name    : String,
    quote   : String,
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Testimonial', testimonialSchema);

