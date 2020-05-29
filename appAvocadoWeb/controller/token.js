var mongoose = require('mongoose');
var User = require("../models/Users");
var Token = require("../models/token");

var errResulUtils = require("../controller/errResulUtils");

var initializer = {};


function getToday(){
	var today = new Date();
	dateC=today.toISOString();
	return dateC;
}

function saveTokenInDatabase(req,resp,token){
	var dateC = getToday();
	var param = {	email:req.body.email,
					token:token,
					creation:dateC,
					life:"3600" //seconds
				};
	var tokenObj = new Token(param);
		    
    tokenObj.save(function(err){
        if( err ){ 
        	resp.send(errResulUtils.jsonRespError(50)); 
        }else{
        	resp.send(errResulUtils.jsonRespOK(10,token));
        }
    });
}



function generateToken(){
	var date = new Date();
	var timestamp = date.getTime(); //timestamp creationg
	valor = Math. random();  	 	//random creating
	var result = timestamp *valor//nonce creation
	return (Math.trunc(result)); //returning only integer part
}




function checkUserInDataBase(req,res){
	var param = {	email:req.body.email,
					password:req.body.password
				};
		
		User.find(param).exec(function(err, users){
			if(err){
				res.send(error.jsonRespError(50));
			}
	        if(users.length>0 && users.length<2){	        	
        		token = generateToken();
        		saveTokenInDatabase(req,res,token);       			
       			r=0;	        	
	        }else{			
				r = 3;
	        } 
	    });

}

//Create a Token object
initializer.Token=function(req,res){
	//We evaluate if some of the parameters are empty
	//In case, return an error	
	var r=errResulUtils.someFieldIsEmpty(req);
	
	if (r==0){
			checkUserInDataBase(req,res);
			r = 0;	//it is callback in database, error control must be controlled previouslly
		
	}
	return r;
}


function isStillFresch(creation,life,cDate){
	const origin = Date.parse(creation);
	var originPlusLife = parseInt(origin) + (parseInt(life)*1000); //it must be multiplicated for 1000 because miliseconds
	const now = parseInt(Date.parse(cDate));
   console.log(origin);
   console.log(originPlusLife);
   console.log(now);
	if(now<=originPlusLife){
		return true;
	}else{
		return false;
	}
}


function isValid(tok,res){
	var retorno=0;
	var param={token:tok};
	//Check if token exists in the database
	
	Token.find(param).exec(function(err, tokens){
		if(err){
			res.send(errResulUtils.jsonRespError(50));
		}
        if(tokens.length==1){
        	//Consult creation and life en seconds
       		creation = tokens[0].creation;
       		life = tokens[0].life;
       		var dateC = getToday();//Calculate current date
	       	var r=isStillFresch(creation,life,dateC); //Evaluate if current date wrt creationg and life is still valid
	       	if (r==false) res.send(errResulUtils.jsonRespOK(12,r)); 	
	       	else res.send(errResulUtils.jsonRespOK(11,r)); 
        }else{			
			res.send(errResulUtils.jsonRespOK(12,false)); 
        }
    });
	return retorno;	
}

initializer.isValidTempo=function(tok,res){
	return isValid(tok,res);
}

module.exports = initializer;