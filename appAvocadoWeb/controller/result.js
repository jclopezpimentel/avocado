var initializer = {};


function answer(codigo){
	switch(codigo){
		case 1: res="Root id created ";break;
		case 2: res="Smart Contract address";break;
		case 3: res="Transaction address";break;
		case 4: res="Administrator id created in Root Smart Contract";break;
		default: res="Not Explanation";
	}
	return res;	
}


initializer.jsonResp = function (codigo) {
	var resp ={
		result: "Success",
		Explanation:answer(codigo)
	};
	return resp;
}


initializer.jsonResp = function (codigo,res) {
	var resp ={
		result: res,
		Explanation:answer(codigo)
	};
	return resp;
}




module.exports = initializer;