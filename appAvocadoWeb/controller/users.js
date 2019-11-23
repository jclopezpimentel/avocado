var mongoose = require('mongoose');
var Root = require("../models/Root");


var initializer = {};


initializer.login = function(req, res) {
	email = req.body.email;
	var word = "root@root.jc"; 
	if(email===word){
		loguear(req,res,word);
		//if(r===false){
		//	res.render('gral',{output:'Usuario colocó password incorrecto'});
		//}
	}else{
		res.render('gral',{output:'Validar autentificación de usuario'});
	}
}


function loguear(req,res,word){
	Root.find({email:word}).exec(function(err, users){
        if( err ){ 
        	console.log('Error: ', err); 
			res.render('error',{message: "Something wrong is happening!", error:err});
        }
        if(users.length===1){
        	if(req.body.password===users[0].password){
        		sessionId = (Math.random()*10000)+1;
                req.session.sessionId = sessionId; 
                
        		res.render('rootOptions',{ output:'authentificado', ssid:req.session.sessionId});
        	}else{
        		res.render('gral',{output:'Authentication was not succesful'});	
        	}
        }
    });
}


module.exports = initializer;
