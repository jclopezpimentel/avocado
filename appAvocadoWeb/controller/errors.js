var initializer = {};


function answer(codigo){
	switch(codigo){
		//Errors between 1 to 10 corresponds to Root creation
		//case 0 is not an error
		case 1: res="Error " + codigo + ": Root already created ";break;
		case 2: res="Error " + codigo + ": Someone else is trying to create the root";break;
		case 3: res="Error " + codigo + ": root has not been created";break;
		case 4: res="Error " + codigo + ": it is necessary to be a root for this request";break;
		//Errors respect to parameters
		case 10: res="Error " + codigo + ": some parameteres are empty";break;
		//Errors respect to database conection
		case 50: res="Error " + codigo + ": problem accesing to the database";break;
		case 51: res="Error " + codigo + ": Check that mongodb is available";break;
		case 52: res="Error " + codigo + ": database unkown error"; break;
		case 53: res="Error " + codigo + ": query problems"; break;
		//Errors related with blockchain connection
		case 60: res="Error " + codigo + ": problem accesing to the blockchain";break;
		default: res="Error " + codigo + ": Unkown error";
	}
	return res;	
}


initializer.jsonResp = function (codigo) {
	var resp ={
		result: "Error",
		Explanation:answer(codigo)
	};
	return resp;
}


initializer.error = function (codigo) {
	return answer(codigo);
}
module.exports = initializer;