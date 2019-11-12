var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: true });
var port = 3000;

//developing a list of objects; each one with two keys: public address account and its contract
//Initializing with empty values
var vehiclesContracts = []; 

var contador=0;

app.get('/', function(req, res) {
  res.send("Contador = " + (++contador));
});

app.get('/addManufacturers', function(req, res) {
  frontAddM(req, res);
});

app.get('/frontRegistryVehicle', function(req, res) {
  frontRegistryVehicle(req, res);
});



app.get('/frontCreateContract', function(req, res) {
  frontCreateContract(req, res);
});

app.get('/frontGetInfoVehicle', function(req, res) {
  frontGetInfoVehicle(req, res);
});


app.get('/accounts', function(req, res) {
	accounts(req, res);
});

app.get('/getMyContract', function(req, res) {
	getMyContract(req, res);
});

app.get('/getBalance', function(req, res) {
	getBalance(req, res);
});

app.get('/getBalanceGral', function(req, res) {
	getBalanceG(req, res);
});

app.get('/getInfo', function(req, res) {
	getInfoVehicle(req, res);
});


app.post('/exec/getInfoVehicle', urlencodedParser, function (req, res){
	execGetInfoVehicle(req,res);
 });



app.post('/exec/addM', urlencodedParser, function (req, res){
	addM(req,res);
 });


app.post('/exec/registryVehicle', urlencodedParser, function (req, res){
	registryVehicle(req,res);
 });



app.post('/exec/createContract', urlencodedParser, function (req, res){
	createContract(req,res);
 });


app.listen(port, function() {
  console.log('Aplicación ejemplo, escuchando el puerto ' + port + '!');
});


function frontCreateContract(req, res){
    var fs = require('fs');
    fs.readFile('frontEnd/createContract.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
  });
}



function frontGetInfoVehicle(req, res){
    var fs = require('fs');
    fs.readFile('frontEnd/getInfoVehicle.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
  });
}



//functions to display front-end of Add Manufacturers 
function frontAddM(req, res) {
    var fs = require('fs');
    fs.readFile('frontEnd/addManufacturers.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
  });
}


//functions to display front-end Registry Vehicles
function frontRegistryVehicle(req, res) {
    var fs = require('fs');
    fs.readFile('frontEnd/registryVehicle.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
  });
}



resGetInfo = null;
function getInfoVehicle(req,res){
	var leyenda = "Resultado de getInfo es: " + resGetInfo;
    res.send(leyenda);
    res.end();
}


function execGetInfoVehicle(req, res) {
	var reply='';

	address2 = req.body.addressM;


		//compiler = require('solc');
		const fs = require('fs'); 
		sourceCode = fs.readFileSync('Vehicles.sol', 'UTF8').toString();
		const path = require('path');	
		const solc = require('solc');
		const veh = path.resolve('', '', 'Vehicles.sol');
		const source = fs.readFileSync(veh, 'UTF-8');
	
		var input = {
		    language: 'Solidity',
		    sources: {
		        'Vehicles.sol' : {
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
		vehContract = contracts['Vehicles.sol'].Vehicles.abi;
	
		var Web3 = require('web3');
		var web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

		//Se crea el objecto contractVeh, una vez que ya creamos el contrato
		//Para ello es necesario la variable vehContract que es la que contiene el parámetro ABI y
		//La dirección del contrato, la cuál recuperamos de la variable creada después de hacer el deploy
	var contractVeh = new web3.eth.Contract(vehContract, vehiclesContracts[0].contract._address);

		//Mandamos a llamar el resultado de getInfo
	resultado = null;
	contractVeh.methods.getInfo(vehiclesContracts[0].contract._address).call({from: address2, gas: 4700000}).then(
		    	function(result){
		    		resGetInfo = result;
	});



	reply += "Your Address is" + address2;
	reply += "Info of the vehicles is:" + resultado;
	reply += " Si es nulo es porque porque se procesó en background ";
	reply += "Consulta nuevamente en: <a href='http://localhost:3000/getInfo'>/getInfo</a>";
	res.send(reply);

}

function registryVehicle(req, res) {
	var reply='';

	nveh = req.body.description;
	address2 = req.body.addressM;
	address = req.body.addressG;


		//compiler = require('solc');
		const fs = require('fs'); 
		sourceCode = fs.readFileSync('Vehicles.sol', 'UTF8').toString();
		const path = require('path');	
		const solc = require('solc');
		const veh = path.resolve('', '', 'Vehicles.sol');
		const source = fs.readFileSync(veh, 'UTF-8');
	
		var input = {
		    language: 'Solidity',
		    sources: {
		        'Vehicles.sol' : {
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
		vehContract = contracts['Vehicles.sol'].Vehicles.abi;

		var Web3 = require('web3');
		var web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
	
		//Se crea el objecto contractVeh, una vez que ya creamos el contrato
		//Para ello es necesario la variable vehContract que es la que contiene el parámetro ABI y
		//La dirección del contrato, la cuál recuperamos de la variable creada después de hacer el deploy
	var contractVeh = new web3.eth.Contract(vehContract, vehiclesContracts[0].contract._address);
	contractVeh.methods.add(address2).send({from: address,gas: 4700000}).then(console.log);
	resultado = null;		
	contractVeh.methods.registry(nveh).send({from: address2,gas: 4700000}).then(
	    	function(result){
    		resultado = result;
		});


/*
		

		//Mandamos a llamar el resultado de getInfo
		contractVeh.methods.getInfo(vehiclesContracts[0].contract._address).call({from: address2, gas: 4700000}).then(
		    	function(result){
		    		resultado = result;
			});


		//De la página:
		//https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html
    */	




	reply += "The auto description is " + nveh;
	reply += "Your Address is" + address2;
	reply += "Consulta los datos del vehículo en: <a href='http://localhost:3000/frontGetInfoVehicle'>/frontGetInfoVehicle</a>";
	res.send(reply);



}


//functions to process incoming requests
function addM(req, res) {
	var reply='';

	address2 = req.body.addressM;
	address = req.body.addressG;


		//compiler = require('solc');
		const fs = require('fs'); 
		sourceCode = fs.readFileSync('Vehicles.sol', 'UTF8').toString();
		const path = require('path');	
		const solc = require('solc');
		const veh = path.resolve('', '', 'Vehicles.sol');
		const source = fs.readFileSync(veh, 'UTF-8');
	
		var input = {
		    language: 'Solidity',
		    sources: {
		        'Vehicles.sol' : {
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
		vehContract = contracts['Vehicles.sol'].Vehicles.abi;
	
		var Web3 = require('web3');
		var web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");


		//Se crea el objecto contractVeh, una vez que ya creamos el contrato
		//Para ello es necesario la variable vehContract que es la que contiene el parámetro ABI y
		//La dirección del contrato, la cuál recuperamos de la variable creada después de hacer el deploy
	var contractVeh = new web3.eth.Contract(vehContract, vehiclesContracts[0].contract._address);
	contractVeh.methods.add(address2).send({from: address,gas: 4700000}).then(console.log);

	reply += "Your name is" + req.body.name;
	reply += "Your Address is" + address2;
	reply += "Registra un vehículo en <a href='http://localhost:3000/frontRegistryVehicle'>/frontRegistryVehicle</a>";
	res.send(reply);


/*
		

		//address3 = "0x5eD71D31029Fb82604E2557E27F55747A3D00B11";
		//contractVeh.methods.add(address3).send({from: address2}).then(console.log);

		nveh = "CX-5, 2019";
		resultado = null;		
		contractVeh.methods.registry(nveh).send({from: address2,gas: 4700000}).then(
	    	function(result){
	    		resultado = result;
		});

		//Mandamos a llamar el resultado de getInfo
		contractVeh.methods.getInfo(vehiclesContracts[0].contract._address).call({from: address2, gas: 4700000}).then(
		    	function(result){
		    		resultado = result;
			});


		//De la página:
		//https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html
    */	



}






// only methods with respect to solidity and web3

function createContract(req, res){
	//var vehiclesContracts = [];
	compiler = require('solc');
	const fs = require('fs'); 
	sourceCode = fs.readFileSync('Vehicles.sol', 'UTF8').toString();
	const path = require('path');	
	const solc = require('solc');
	const veh = path.resolve('', '', 'Vehicles.sol');
	const source = fs.readFileSync(veh, 'UTF-8');
	
	var input = {
	    language: 'Solidity',
	    sources: {
	        'Vehicles.sol' : {
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
	vehContract = contracts['Vehicles.sol'].Vehicles.abi;
	byteCodeVeh = contracts['Vehicles.sol'].Vehicles.evm.bytecode.object;

	var Web3 = require('web3');
	var web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

	vehicleContract = new web3.eth.Contract(vehContract);
	//address = "0x9B5482c2281988aF7b928fCB034338C198AdCCAd";
	address = req.body.dir; //obtaining public key account
    vehicleContract.deploy({data: byteCodeVeh}).send({from: address, gas: 4700000}).then(
    	function(result){
    		var i = vehiclesContracts.length;
    		var firstElement = {"publicKey": address, "contract": result};
    		vehiclesContracts[i] = firstElement;
    	});

    res.send("Contract being created by: " + address + " Now execute <a href='http://localhost:3000/getMyContract'>/getMyContract</a>");
    //write
    res.end();

    /*
    	Estoy probando esto:
		address2 = "0x21316Ac89814F45867195400004453f390F1176B";
		
		//Se crea el objecto contractVeh, una vez que ya creamos el contrato
		//Para ello es necesario la variable vehContract que es la que contiene el parámetro ABI y
		//La dirección del contrato, la cuál recuperamos de la variable creada después de hacer el deploy
		var contractVeh = new web3.eth.Contract(vehContract, vehiclesContracts[0].contract._address);
		contractVeh.methods.add(address2).send({from: address,gas: 4700000}).then(console.log);

		//address3 = "0x5eD71D31029Fb82604E2557E27F55747A3D00B11";
		//contractVeh.methods.add(address3).send({from: address2}).then(console.log);

		nveh = "CX-5, 2019";
		resultado = null;		
		contractVeh.methods.registry(nveh).send({from: address2,gas: 4700000}).then(
	    	function(result){
	    		resultado = result;
		});

		//Mandamos a llamar el resultado de getInfo
		contractVeh.methods.getInfo(vehiclesContracts[0].contract._address).call({from: address2, gas: 4700000}).then(
		    	function(result){
		    		resultado = result;
			});


		//De la página:
		//https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html
    */
}


function getMyContract(req, res) {
	console.log(vehiclesContracts);
	var leyenda = "My contract address is: " + vehiclesContracts[0].contract._address;
	leyenda += "<br><a href='http://localhost:3000/addManufacturers'>/addManufacturers</a>";
    //vehiclesContracts[0].publicKey
    res.send(leyenda);
    res.end();
}




function accounts(req, res) {
    var Web3 = require('web3');
    var web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
    web3.eth.getAccounts().then(s =>{
        firstA = web3.utils.hexToUtf8(s[0]);
        res.send(firstA);
        console.log(firstA);
    });
    res.write("Processing");
    res.end();
}

var balanceGral =0;

function getBalance(req,res){
    var Web3 = require('web3');
    var web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");
    var address = "0x9B5482c2281988aF7b928fCB034338C198AdCCAd";
	web3.eth.getBalance(address, (err,bal) => {
		balance = bal;
		balanceGral = balance;
		console.log(balance);
		//res.write(balance);
		//res.send(balance);
	});
	res.write("Processed");
    res.end();

}

function getBalanceG(req,res){
	res.write(balanceGral);
    res.end();
}
