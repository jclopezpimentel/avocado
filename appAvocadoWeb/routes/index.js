var express = require('express');
var router = express.Router();

var contr = require('../controller/index.js');
var us = require('../controller/users.js');
/* GET home page. */

/*router.get('/', function(req, res, next) {
  var r = initialized();
  res.render('index', { title: 'Sig-in' });
});
*/

/* GET home page. */
/*router.get('/getMyContract', function(req, res, next) {
  getMyContract(req,res);
});

router.post('/exec/createContract', function (req, res, next){
	var answer = createContract(req,res);
   	res.render('contractCreated', { resp: answer });
 });
*/

router.get('/', contr.index);
//router.get('/getMyContract/dirs/:dirId', contr.getMyContract);
router.get('/getMyContract', contr.getMyContract);
router.post('/getSmartContract', us.getSmartContract);
router.post('/exec/createContract', contr.createContract);
router.post('/exec/authenticate', us.login);


module.exports = router;



