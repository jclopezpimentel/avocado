var User = require("../models/Users");


var initializer = {};
//Save root in database


initializer.save = function (req,addrC,addrT, statusp,resp,who) {
    var param = {   email:req.body.email,
                    password:req.body.password,
                    addressU:req.body.addressU,
                    addressContract:addrC,
                    addressTransaction:addrT,
                    status:statusp};
    var user = new User(param);
            
    user.save(function(err){
        if( err ){ 
            resp.send(error.jsonRespError(50)); 
        }else{
            resp.send(result.jsonRespOK(who,user._id));;
        }
    });    
}

module.exports = initializer;
