var mongoose = require('mongoose');
var Root = require("../models/Root");

var initializer = {};
//developing a list of objects; each one with two keys: public address account and its contract
//Initializing with empty values

//var vehiclesContracts = []; 
var receiptG;


initializer.index = function(req, res, next) {
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
			 	res.render('index', { title: 'Create Contract' });   
		    }
	    });
	}catch(err){
		//res.send(err);
	 	res.render('error', { message: "Check that mongodb is available", error:err}); 
	}

}


initializer.getMyContract = function (req, res) {
	//console.log(vehiclesContracts);
	console.log(receiptG);
	var leyenda = dataContract(); 
    res.send(leyenda);
    res.end();
}

function dataContract(){
	//var leyenda = "My contract address is: " + vehiclesContracts[0].contract._address;
	var leyenda = "The transaction address is: " + receiptG.transactionHash + "<br>";
	leyenda += "The contract address is: " + receiptG.contractAddress + "<br>";
    //var r = save(req,vehiclesContracts[0].contract._address);
	r=1;
	leyenda += "<br><a href='http://localhost:3000/addManufacturers'>/addManufacturers</a>" + " and id=" + r;
	return leyenda;
}


// only methods with respect to solidity and web3
var candado =true;

initializer.createContract = function (req, res){
	//Considerar variables estáticas por el número de peticiones
	console.log("El valor de candado es: "+ candado);
	if(candado){ //only one thread must intro in this part
		candado = false;
	var rootEmail = 'root@root.jc';
	Root.find({email:rootEmail}).exec(function(err, users){
        if(users.length>0)
        { 
        	console.log("Root must not be created again:)");
		   	res.render('contractCreated', { resp: 'Contract ya había sido creado' });
        }else{
			var answer = contractCreation(req,res);
		   	res.render('contractCreated', { resp: answer });
        } 
    });		

	}else{
		console.log("Hay otra petición en este mismo instante!!!");
		res.render('contractCreated', { resp: "Alguien más está entrando" });
	}

}

initializer.createAdmor = function (req, res){
	var addressR = req.body.addressR;
	Root.find({addressRoot:addressR}).exec(function(err, users){
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

function save(req,addrC,addrT){
	var rootEmail = 'root@root.jc';
	var param = {email:rootEmail,password:req.body.password,addressRoot:req.body.dir,addressContract:addrC,addressTransaction:addrT};
	var root = new Root(param);
		    
    root.save(function(err){
        if( err ){ 
        	console.log('Error: ', err); 
        	return -1; 
        }        
        console.log("Successfully created a root. :)");
        candado =true; //we must liberate the lock
        return root._id;
    });
}




function contractCreation(req,res){
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
	byteCodeVeh = contracts.avocadoSol.Avocado.evm.bytecode.object; //it depends of the Contract name

	var Web3 = require('web3');
	var web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

	avocadoContract = new web3.eth.Contract(avoContract);
	//address = "0x9ec815Ef8f3E8B3d922C3c57308b1D7C3f2aE91f";
	address = req.body.dir; //obtaining public key account
    avocadoContract.deploy({data: byteCodeVeh}).send({from: address, gas: 4700000}).on('receipt', function(receipt){
     	receiptG = receipt;
     	save(req,receiptG.contractAddress,receiptG.transactionHash); //add user to the database
     }).on('error', console.error);

    /*.then(
    	function(result){
    		var i = vehiclesContracts.length;
    		var firstElement = {"publicKey": address, "contract": result};
    		vehiclesContracts[i] = firstElement;
    		save(req,firstElement.contract._address); //add user to the database
    	});*/

    //res.send("Contract being created by: " + address + " Now execute <a href='http://localhost:3000/getMyContract'>/getMyContract</a>");

    //write
    //res.end();
    return address;
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


module.exports = initializer;