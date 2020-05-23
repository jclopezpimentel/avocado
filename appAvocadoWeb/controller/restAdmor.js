var root = require("../controller/root");
var error = require("../controller/errResulUtils");

var initializer = {};

initializer.createAdmor = function (req, res){
	var email=req.query.email;
	var password=req.query.password;
	var addressA=req.query.addressA; //obtain Administrator address
	var addressR=req.query.addressR; //obtain root address
	var addressContract=req.query.addressContract; //obtain Contract Address of the root

	var obj={body:{email:email,
					password:password,
					addressA:addressA,
					addressR:addressR,
					addressContract:addressContract
				  }
			};
	var answerCode = root.AddAdmor(obj,res); //Root is who creates each administrator
	if(answerCode!=0){ 
		//it means that an error has happened
		//These erros are controlled when not callback functions are implemented yet 
		res.send(error.jsonRespError(answerCode)); //error code is sent as an answer
	}else{//it means that an error number 0 happened, it is out our reach
		
	}
}


/*
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
		res.send(error.jsonResp(answerCode)); //error code is sent as an answer
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
		res.send(error.jsonResp(answerCode)); //error code is sent as an answer
	}else{//it means that an error number 0 happened, it is out our reach
		//res.send("Root created with address:" + addressU);
	}

}

*/

module.exports = initializer;