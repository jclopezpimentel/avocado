var mongoose = require('mongoose');
var Root = require("../models/Root");
var error = require("../controller/errors");
var initializer = {};

//recepitG is a json that includes  all data about the root transaction
var receiptG;
var candado =true;
var statusV = "rootCreation";


function someFieldIsEmpty(ob){
	var obj = ob.body;
	var n = Object.keys(obj).length;

	for(var i=0;i<n;i++){
		var field=Object.keys(obj)[i];
		var fieldV= obj[field];
		console.log(fieldV);
		if(fieldV==""){
			return 10;
		}
	}
	return 0;
	
}


initializer.getAddContrR = function (par,resp) {	
	var r=someFieldIsEmpty(par);
	if (r==0){
		Root.find({status:statusV}).exec(function(err, users){
			if(err){
				resp.send(error.jsonResp(50));
				r=50;
			}
	        if(users.length>0 && users.length<2)
	        { 
	        	if(par.body.email==users[0].email && par.body.pass==users[0].password){
	        		res = users[0].addressContract;
       				var obj ={
						AddressContract: res
						};        
        			resp.send(obj);;
        			r=0;
	        	}else{
	        		r = 4;
	        	}
	        	
	        }else{			
				r = 3;
	        } 
	    });
	}else{
		return r;
	}
	return r;
}

initializer.getAddTransR = function (par,resp) {	
	var r=someFieldIsEmpty(par);
	if (r==0){
		Root.find({status:statusV}).exec(function(err, users){
			if(err){
				resp.send(error.jsonResp(50));
				r=50;
			}
	        if(users.length>0 && users.length<2)
	        { 
	        	if(par.body.email==users[0].email && par.body.pass==users[0].password){
	        		res = users[0].addressTransaction;
       				var obj ={
						addressTransaction: res
						};        
        			resp.send(obj);;
        			r=0;
	        	}else{
	        		r = 4;
	        	}
	        	
	        }else{			
				r = 3;
	        } 
	    });
	}else{
		return r;
	}
	return r;
}


//Save root in database
function save(req,addrC,addrT, statusp,resp){
	var param = {	email:req.body.email,
					password:req.body.password,
					addressU:req.body.addressU,
					addressContract:addrC,
					addressTransaction:addrT,
					status:statusp};
	var root = new Root(param);
		    
    root.save(function(err){
        if( err ){ 
        	candado = true;
        	resp.send(error.jsonResp(50)); 
        }
        console.log("Successfully created a root. :)");
        candado =true; //lock liberated
		var obj ={
				result: "Root created with address:" + param.addressU
			};        
        resp.send(obj);;
    });
}

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

	//address = "0x9ec815Ef8f3E8B3d922C3c57308b1D7C3f2aE91f";
	address = req.body.addressU; //obtaining public key account
	var resultado = 0;
	try{
		var Web3 = require('web3');
		var web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

		rootContract = new web3.eth.Contract(avoContract);
	    rootContract.deploy({data: byteCodeVeh}).send({from: address, gas: 4700000
	    	}, function(err, transactionHash){
	    		if(err){
	    			candado = true;
        			resp.send(error.jsonResp(60));
        			return 60;
	    		}
	    	})
	    	.on('receipt', function(receipt){
	     		receiptG = receipt;
	     	save(req,receiptG.contractAddress,receiptG.transactionHash,statusV,resp); //add user to the database
	     }).on('error', console.error); 
	}catch(err){
		console.log(err.message);
		resultado = 60;
	}

    return resultado;
}



function checkMutualExclusion(req,resp){
	//Considerar variables estáticas por el número de peticiones
	console.log("El valor de candado es: "+ candado);
	var res=0;
	if(candado){ //only one thread must intro in this part
		candado = false; 
		Root.find({status:statusV}).exec(function(err, users){
			if(err){
				candado = true;
				resp.send(error.jsonResp(53)); 
			}
	        if(users.length>0)
	        { 
	        	candado = true;
			   	resp.send(error.jsonResp(1)); 
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
	var r=someFieldIsEmpty(req);
	if (r==0){
		var resp = checkMutualExclusion(req,res);
		return resp;
	}else{
		return (10);
	}
}




//functions to process incoming requests
function addAdmor(req, res, addressContract) {
	var reply='';

	address2 = req.body.addressA;
	address = req.body.addressR;

	compiler = require('solc');
	const fs = require('fs'); 
	const avocadoSol = 'Avocado.sol';
	sourceCode = fs.readFileSync(avocadoSol, 'UTF8').toString();
	const path = require('path');	
	const solc = require('solc');
	const veh = path.resolve('', '', avocadoSol);
	const source = fs.readFileSync(veh, 'UTF-8');
	
	var input = {
	    language: 'Solidity',
	    sources: {
	        avocadoSol : {
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
	avoContract = contracts.avocadoSol.Avocado.abi; //it depends of the Contract name

	//avoContract = contracts['Vehicles.sol'].Vehicles.abi;
	
	var Web3 = require('web3');
	var web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");


		//Se crea el objecto avocadoContract, una vez que ya creamos el contrato
		//Para ello es necesario la variable avoContract que es la que contiene el parámetro ABI y
		//La dirección del contrato, la cuál recuperamos de la variable creada después de hacer el deploy
	var avocadoContract = new web3.eth.Contract(avoContract, addressContract);
	avocadoContract.methods.addAdmor(address2).send({from: address,gas: 4700000}).then(console.log);

	reply += "Your name is" + req.body.name;
	reply += "Admor address added is" + address2;
	reply += "Agregaste un administrador <a href='http://localhost:3000/frontRegistryVehicle'>/frontRegistryVehicle</a>";
	res.render('gral', { output: reply });
}

initializer.createAdmor = function (req, res){
	var addressR = req.body.addressR;
	Root.find({addressU:addressR}).exec(function(err, users){
		if(err){
			res.send("Hubo un error");
		}
        if(users.length>0)
        { 
        	addAdmor(req, res, users[0].addressContract);
        }else{
		   	res.render('contractCreated', { resp: 'Colocaste un address root does not validate' });
        } 
    });		
	
	//res.send(addressR);
	//res.end();
}


module.exports = initializer;