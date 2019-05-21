const express = require('express');
const router = express.Router();
var RSA = require('hybrid-crypto-js').RSA;
var Crypt = require('hybrid-crypto-js').Crypt;

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log()
  res.send('Welcome!');
});

router.post('/', async (req, res, next) => {
  try {
    console.log('page requested')
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
