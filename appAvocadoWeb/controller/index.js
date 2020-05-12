var mongoose = require('mongoose');


var initializer = {};
//developing a list of objects; each one with two keys: public address account and its contract
//Initializing with empty values


initializer.index = function(req, res, next) {
	//valor = mongoose.Connection.prototype.collections;
	//res.send("val");	
	try{
		mongoose.connection.db.listCollections({name: 'roots'}).next(function(err, collinfo) {
	        if(err){
	        	//Hay un error
	        	res.render('error', { message: 'Hay un error', error:err });
	        }
	        if (collinfo) {
	        	//Ya se creó mandaremos otra vista
	        	res.render('login', { title: 'Sig-in' });
		    }else{
			    //No se ha creado la configuración inicial
			 	res.render('inputRootCreation', { title: 'Create Root' });   
		    }
	    });
	}catch(err){
		//res.send(err);
	 	res.render('error', { message: "Check that mongodb is available", error:err}); 
	}

}


module.exports = initializer;