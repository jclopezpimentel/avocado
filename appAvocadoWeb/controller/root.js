//var mongoose = require('mongoose');
var User = require("../models/Users");
var User_ = require("../controller/users");
var error = require("../controller/errResulUtils");
var result = require("../controller/errResulUtils");
var Token = require("../controller/token");
var initializer = {};

//recepitG is a json that includes  all data about the root transaction
var receiptG;
var candado =true;
var statusV = {rootCreation:"rootCreation",
			   admorCreation:"admorCreationInRootSC"};
var blockchainAddress = "ws://localhost:7545";




initializer.getAddContrR = function (par,resp) {
	var r=result.someFieldIsEmpty(par);	
	if (r==0){
		var tok=par.body.token;
		Token.whoP(tok,function(email){
			if(email==""){
				res.send(error.jsonRespError(70));
			}else{
					User.find({status:statusV.rootCreation}).exec(function(err, users){
						if(err){
							resp.send(error.jsonRespError(50));
						}
				        if(users.length>0 && users.length<2){ 
				        	if(email==users[0].email){ //we check that the token match with the root
				        		res = users[0].addressContract;
			        			resp.send(result.jsonRespOK(2,res));
		        			}else{
	        					resp.send(error.jsonRespError(4));
	        				}
				        }else{			
							resp.send(error.jsonRespError(100));
				        } 
				    });
			}
		});
	}else{
		res.send(error.jsonRespError(r));
	}
}



initializer.getAddTransR = function (par,resp) {	
	var r=result.someFieldIsEmpty(par);	
	if (r==0){
		var tok=par.body.token;
		Token.whoP(tok,function(email){
			if(email==""){
				res.send(error.jsonRespError(70));
			}else{
					User.find({status:statusV.rootCreation}).exec(function(err, users){
						if(err){
							resp.send(error.jsonRespError(50));
						}
				        if(users.length>0 && users.length<2){ 
				        	if(email==users[0].email){ //we check that the token match with the root
				        		res = users[0].addressTransaction;
			        			resp.send(result.jsonRespOK(3,res));
		        			}else{
	        					resp.send(error.jsonRespError(4));
	        				}
				        }else{			
							resp.send(error.jsonRespError(100));
				        } 
				    });
			}
		});
	}else{
		res.send(error.jsonRespError(r));
	}
}

/*
//Save root in database
function save(req,addrC,addrT, statusp,resp){
	var param = {	email:req.body.email,
					password:req.body.password,
					addressU:req.body.addressU,
					addressContract:addrC,
					addressTransaction:addrT,
					status:statusp};
	var user = new User(param);
		    
    user.save(function(err){
        if( err ){ 
        	candado = true;
        	resp.send(error.jsonRespError(50)); 
        }else{
	        candado =true; //lock liberated  
	        resp.send(result.jsonRespOK(1,user._id));;
        }
    });
}
*/


//save root in the smart contract
function createRootSC(req,resp){
	//rootCreation involves create root in database and create a smart contract
	compiler = require('solc');
	const fs = require('fs'); 
	const rootSol = 'RootSC.sol';
	sourceCode = fs.readFileSync(rootSol, 'UTF8').toString();
	const path = require('path');	
	const solc = require('solc');
	const veh = path.resolve('', '', rootSol);
	const source = fs.readFileSync(veh, 'UTF-8');
	
	var input = {
	    language: 'Solidity',
	    sources: {
	        rootSol : {
	            content: source
	        }
	    },
	    settings: {
	        outputSelection: {
	            '*': {
	                '*': [ '*' ]
	            }
	        }
	    }
	}; 
	compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));
	contracts = compiledCode.contracts;
	avoContract = contracts.rootSol.RootSC.abi; //it depends of the Contract name
	byteCodeVeh = contracts.rootSol.RootSC.evm.bytecode.object; //it depends of the Contract name

	address = req.body.addressU; //obtaining public key account
	var resultado = 0;
	try{
		var Web3 = require('web3');
		var web3 = new Web3(Web3.givenProvider || blockchainAddress);

		rootContract = new web3.eth.Contract(avoContract);
	    rootContract.deploy({data: byteCodeVeh}).send({from: address, gas: 4700000
	    	}, function(err, transactionHash){
	    		if(err){
	    			candado = true;
        			resp.send(error.jsonRespError(60));
        			return 60;
	    		}
	    	})
	    	.on('receipt', function(receipt){
	     		receiptG = receipt;
	     	User_.save(req,receiptG.contractAddress,receiptG.transactionHash,statusV.rootCreation,resp,1); //add user to the database
	     }).on('error', console.error); 
	}catch(err){
		resultado = 60;
	}

    return resultado;
}



function checkMutualExclusion(req,resp){
	//Considerar variables estáticas por el número de peticiones
	var res=0;
	if(candado){ //only one thread must intro in this part
		candado = false; 
		User.find({status:statusV.rootCreation}).exec(function(err, users){
			if(err){
				candado = true;
				resp.send(error.jsonRespError(53)); 
			}
	        if(users.length>0)
	        { 
	        	candado = true;
			   	resp.send(error.jsonRespError(1)); 
	        }else{
				var answer = createRootSC(req,resp);
				res = answer;	
	        } 
	    });
	}else{		
		res = 2; // error numer 2 is returned
	}
	return res;
}

//this is the constructor of the root
initializer.Root=function(req,res){
	//We evaluate if some of the parameters are empty
	//In case, return an error	
	var r=result.someFieldIsEmpty(req);
	if (r==0){
		var resp = checkMutualExclusion(req,res);
		return resp;
	}else{
		return (r);
	}
}

/*
function saveAdmor(req,addrC,addrT, statusp,resp){
	var param = {	email:req.body.email,
					password:req.body.password,
					addressU:req.body.addressR,
					addressContract:addrC,
					addressTransaction:addrT,
					status:statusp};
	var user = new User(param);
    user.save(function(err){
        if( err ){ 
        	resp.send(error.jsonRespError(50)); 
        }else{
	        resp.send(result.jsonRespOK(4,user._id));;
        }
    });
}
*/

function createAdmorSC(req,res){
	//createAdmorSC involves create Admor in database and add it within the root knowledge
	compiler = require('solc');
	const fs = require('fs'); 
	const rootSol = 'RootSC.sol';
	sourceCode = fs.readFileSync(rootSol, 'UTF8').toString();
	const path = require('path');	
	const solc = require('solc');
	const veh = path.resolve('', '', rootSol);
	const source = fs.readFileSync(veh, 'UTF-8');
	
	var input = {
	    language: 'Solidity',
	    sources: {
	        rootSol : {
	            content: source
	        }
	    },
	    settings: {
	        outputSelection: {
	            '*': {
	                '*': [ '*' ]
	            }
	        }
	    }
	}; 
	compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));
	contracts = compiledCode.contracts;
	rContract = contracts.rootSol.RootSC.abi; //it depends of the Contract name
	byteCodeVeh = contracts.rootSol.RootSC.evm.bytecode.object; //it depends of the Contract name

	addressA = req.body.addressA; //obtain Administrator address
	addressR = req.body.addressR; //obtain root address
	addressContract = req.body.addressContract; //obtain Contract Address of the root

	var resultado = 0;
	try{
		var Web3 = require('web3');
		var web3 = new Web3(Web3.givenProvider || blockchainAddress);

		//Adding Administrator in the blockchain*******************************
		//Object rootContract is created from abi template and the contract address
		var rootContract = new web3.eth.Contract(rContract, addressContract);
		rootContract.methods.addAdmor(addressA).send({from: addressR,gas: 4700000}, 
			function(err, transactionHash){
	    		if(err){
        			res.send(error.jsonResp(60));
        			return 60;
	    		}
	    	})
	    	.on('receipt', function(receipt){
	     		receiptG = receipt;//Getting the receipt of the transaction
	     		User_.save(req,"No contract address in this transaction",receiptG.transactionHash,statusV.admorCreation,res,4); //add user to the database
	     		candado=true;
	     	}).on('error', console.error);
	     //*********************************************************************
	}catch(err){
		resultado = 60;
	}

    return resultado;
}


//Create an administrator
initializer.AddAdmor=function(req,res){
	//We evaluate if some of the parameters are empty
	//In case, return an error	
	var r=result.someFieldIsEmpty(req);
	if (r==0){
			var answer = createAdmorSC(req,res);
			r = answer;	
		
	}
	return r;
}


module.exports = initializer;