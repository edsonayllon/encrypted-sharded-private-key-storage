const express = require('express');
const router = express.Router();
var RSA = require('hybrid-crypto-js').RSA;
var Crypt = require('hybrid-crypto-js').Crypt;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Welcome!');
});

module.exports = router;
