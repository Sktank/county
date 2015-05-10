var mongoose = require('mongoose');

var metaSchema = mongoose.Schema({

    bannerTitle                 : String,
    bannerSubtextBig            : String,
	bannerSubtextSmall          : String,
	homeAboutHeader             : String,
	homeAboutText               : String,

	homeSectionsHeader          : String,

	homeSection1Header          : String,
	homeSection2Header          : String,
	homeSection3Header          : String,

	homeSection1Text            : String,
	homeSection2Text            : String,
	homeSection3Text            : String,

	homeSection1Icon            : String,
	homeSection2Icon            : String,
	homeSection3Icon            : String,

	homeSection1Link            : String,
	homeSection2Link            : String,
	homeSection3Link            : String,

	nmlsNumber                  : String,

	address                     : String,
	phone                       : String,
	fax                         : String,
	email                       : String,

	paymentLink                 : String,

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Meta', metaSchema);