var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var RootSchema = new Schema({
    email: {type: String, required: true, max: 50},
    password: {type: String, required: true, max: 50},
    addressRoot: {type: String, required: true, max: 200},
    addressContract: {type: String, required: true, max: 200},
    addressTransaction: {type: String, required: true, max: 200},
});

//Example about models
//http://micaminomaster.com.co/herramientas-desarrollo/nodejs-projecto-esqueleto-mvc-crud/ 
module.exports = mongoose.model('Root', RootSchema);