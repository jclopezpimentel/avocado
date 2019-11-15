var express = require('express');
var router = express.Router();

//developing a list of objects; each one with two keys: public address account and its contract
//Initializing with empty values
var vehiclesContracts = []; 


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Sig-in' });
});


/* GET home page. */
router.get('/getMyContract', function(req, res, next) {
  getMyContract(req,res);
});



router.post('/exec/createContract', function (req, res, next){
	var answer = createContract(req,res);
   	res.render('contractCreated', { resp: answer });
 });


module.exports = router;



function getMyContract(req, res) {
	console.log(vehiclesContracts);
	var leyenda = "My contract address is: " + vehiclesContracts[0].contract._address;
	leyenda += "<br><a href='http://localhost:3000/addManufacturers'>/addManufacturers</a>";
    //vehiclesContracts[0].publicKey
    res.send(leyenda);
    res.end();
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

    //res.send("Contract being created by: " + address + " Now execute <a href='http://localhost:3000/getMyContract'>/getMyContract</a>");

    //write
    //res.end();
    return "Contract being created by: " + address;
}
