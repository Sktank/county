
var mongoose = require('mongoose');

var transactionSchema = mongoose.Schema({
    name       : String,
    address    : String,
    img        : String,
    position   : Number,
    thheight   : String,
    thwidth    : String,
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Transaction', transactionSchema);

