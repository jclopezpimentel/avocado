var mongoose = require('mongoose');
//var Root = require("../models/Root");

var initializer = {};


initializer.login = function(req, res) {
	pass = req.body.password; //obtaining public key account
    res.send("password:"+ pass);
    res.end();
}


module.exports = initializer;
