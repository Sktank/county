var User      = require('./models/user');

module.exports = function(app, passport) {

    app.get('/', function (req, res) {
        res.render('home.html');
    });

    app.get('/contact', function (req, res) {
        res.render('contact.html');
    });

    app.get('/events', function (req, res) {
        res.render('events.html');
    });

    app.get('/west-windsor-links', function (req, res) {
        res.render('ww_links.html');
    });

    app.get('/plainsboro-links', function (req, res) {
        res.render('plainsboro_links.html');
    });

    app.get('/school-links', function (req, res) {
        res.render('school_links.html');
    });

    app.get('/archives', function (req, res) {
        res.render('archives.html');
    });
}	