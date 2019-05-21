const express = require('express');
const router = express.Router();
var RSA = require('hybrid-crypto-js').RSA;
var Crypt = require('hybrid-crypto-js').Crypt;
const userService = require('../services/user.service');

router.post('/', async (req, res, next) => {
  console.log(req._id, req.body.privateKey);
  try {
    console.log('page requested');
    const stored = await userService.storePrivateKey(
      req._id,
      req.body.privateKey
    )
    console.log(stored);
  } catch (err) {
    console.log(err);
  }
})

module.exports = router;
