

exports.home = function(req, res) {
    // if user is not logged in, ask them to login
    if (typeof req.session.username == 'undefined') res.render('home', { title: 'Hackademy'});
    // if user is logged in already, take them straight to the items list
    else res.redirect('/items');
};

// handler for form submitted from homepage
exports.home_post_handler = function(req, res) {
    // if the username is not submitted, give it a default of "Anonymous"
    username = req.body.username || 'Anonymous';
    // store the username as a session variable
    req.session.username = username;
    // redirect the user to homepage
    res.redirect('/');
};

// our 'database'
var items = {
    FILE:{name:'Upload File'}/*
    SKN:{name:'Shuriken', price:100},
    ASK:{name:'Ashiko', price:690},
    CGI:{name:'Chigiriki', price:250},
    NGT:{name:'Naginata', price:900},
    KTN:{name:'Katana', price:1000}*/
};

// handler for displaying the items
exports.items = function(req, res) {
    // don't let nameless people view the items, redirect them back to the homepage
    if (typeof req.session.username == 'undefined') res.redirect('/');
    else res.render('items', { title: 'Hackademy - Items', username: req.session.username, items:items });
};

// handler for displaying individual items
exports.item = function(req, res) {
    // don't let nameless people view the items, redirect them back to the homepage
    if (typeof req.session.username == 'undefined') res.redirect('/');
    else {
        var name = items[req.params.id].name;
        var price = items[req.params.id].price;
        res.render('item', { title: 'Hackademy - ' + name, username: req.session.username, name:name, price:price });
    }
};

exports.page = function(req, res) {
    var name = req.query.name;
    var contents = {
        about: 'We are a dedicated team of engineers ready to create the next big application.<br><br>Chris Len: UNH--Computer Science <br> Daniel Bolan: UNH--Computer Science <br> Mike Bogochow: UNH--Computer Science <br> Kevin Conley WPI--Electrical Engineering',
        contact: 'You can contact us at <address><strong>Team Too</strong>,<br>1, Dyn Hackademy,<br>Haackers Ave,<br>HCK80B7-JP,<br>United States</address>'
    };
    res.render('page', { title: 'Hackademy - ' + name, username: req.session.username, content:contents[name] });
};
