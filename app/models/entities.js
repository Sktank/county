var mongoose = require('mongoose');

var entitiesSchema = mongoose.Schema({

    type          : String,
    list          : [mongoose.Schema.Types.Mixed],
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Entities', entitiesSchema);