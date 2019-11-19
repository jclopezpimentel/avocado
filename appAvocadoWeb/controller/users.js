var mongoose = require('mongoose');
var Root = require("../models/Root");

var initializer = {};


initializer.login = function(req, res) {
	email = req.body.email;
	var word = "root@root.jc"; 
	if(email===word){
		r = loguear(res,word);
		if(r===false){
			res.render('gral',{output:'Usuario colocó password incorrecto'});
		}
	}else{
		res.render('gral',{output:'Validar autentificación de usuario'});
	}
}


function loguear(res,word){
	Root.find({email:word}).exec(function(err, users){
        if( err ){ 
        	console.log('Error: ', err); 
        	return false; 
        }
        //res.send(users.password);
        res.render('gral',{ output:users.password });
        return true;
        //res.render('../views/product/index', {products: products} );
    });
    return true;
}


module.exports = initializer;
