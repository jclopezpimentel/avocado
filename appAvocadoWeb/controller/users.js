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


initializer.getSmartContract = function (req, res){

    //res.send(req.body.sessionID);
    s = req.session;
    var valor = s.sessionId;
    var leyenda;
    if(req.body.sessionID==valor){
        findContract("root@root.jc",res); 
    }else{
        leyenda = "session: " + valor + ";" + "body.sessionID: " + req.body.sessionID;
        res.render('gralAjaxRes',{ output:leyenda});
    }
    //res.send(leyenda);
    
}

function findContract(word,res){
    var leyenda;
    Root.find({email:word}).exec(function(err, users){
        if( err ){ 
            console.log('Error: ', err); 
            return "Something wrong is happening!";
        }
        if(users.length===1){
            var addressC= users[0].addressContract;
            var addressT= users[0].addressTransaction;
            var leyenda = "The receive address is: " + addressC + "\n";
            leyenda += "The contract address is: " + addressT;
            //return leyenda;
        }else{
            leyenda = "Something wrong is happening!";
        }
        res.render('gralAjaxRes',{ output:leyenda});

    });
    //return "Something wrong is happening 2!";
}


module.exports = initializer;
