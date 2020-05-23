var root = require("../controller/root");
var error = require("../controller/errResulUtils");

var initializer = {};

initializer.createRoot = function (req, res){
	var email=req.query.email;
	var password=req.query.password;
	var addressU=req.query.addressU;7//in this case is the root address
	var obj={body:{email:email,
					password:password,
					addressU:addressU
				  }
			};
	var answerCode = root.Root(obj,res);
	if(answerCode!=0){ 
		//it means that an error has happened
		//These erros are controlled when not callback functions are implemented yet 
		res.send(error.jsonRespError(answerCode)); //error code is sent as an answer
	}else{//it means that an error number 0 happened, it is out our reach
		//res.send("Root created with address:" + addressU);
	}
}


initializer.getAddContrR = function (req, res){
	var email=req.query.email;
	var pass=req.query.pass;	
	var obj={body:{email:email,
					pass:pass
				  }
			};

	var answerCode = root.getAddContrR(obj,res);
	
	if(answerCode!=0){ 
		//it means that an error has happened
		//These erros are controlled when not callback functions are implemented yet 
		res.send(error.jsonRespError(answerCode)); //error code is sent as an answer
	}else{//it means that an error number 0 happened, it is out our reach
		//res.send("Root created with address:" + addressU);
	}

}

initializer.getAddTransR = function (req, res){
	var email=req.query.email;
	var pass=req.query.pass;	
	var obj={body:{email:email,
					pass:pass
				  }
			};

	var answerCode = root.getAddTransR(obj,res);
	
	if(answerCode!=0){ 
		//it means that an error has happened
		//These erros are controlled when not callback functions are implemented yet 
		res.send(error.jsonRespError(answerCode)); //error code is sent as an answer
	}else{//it means that an error number 0 happened, it is out our reach
		//res.send("Root created with address:" + addressU);
	}

}



module.exports = initializer;