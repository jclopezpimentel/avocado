var mongoose = require('mongoose');
var Root = require("../models/Root");

var initializer = {};
//developing a list of objects; each one with two keys: public address account and its contract
//Initializing with empty values

//var vehiclesContracts = []; 
var receiptG;


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

//Esto es como el constructor Root
initializer.createRoot = function (req, res){
	//Considerar variables estáticas por el número de peticiones
	console.log("El valor de candado es: "+ candado);
	if(candado){ //only one thread must intro in this part
		candado = false;
	var statusV = "rootCreation"; 
	Root.find({status:statusV}).exec(function(err, users){
        if(users.length>0)
        { 
        	console.log("Root must not be created again:)");
		   	res.render('contractCreated', { resp: 'Contract ya había sido creado' });
        }else{
			var answer = rootCreation(req,res);
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
	var param = {	email:req.body.email,
					password:req.body.password,
					addressRoot:req.body.dir,
					addressContract:addrC,
					addressTransaction:addrT,
					status:"rootCreation"};
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




function rootCreation(req,res){
	//rootCreation involves create root in database and create a smart contract
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