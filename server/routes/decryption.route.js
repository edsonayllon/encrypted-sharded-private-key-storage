const express = require('express');
const router = express.Router();
var RSA = require('hybrid-crypto-js').RSA;
var Crypt = require('hybrid-crypto-js').Crypt;
const User = require('../models/user.model');
const userService = require('../services/user.service');

var crypt = new Crypt();
var rsa = new RSA();

router.post('/', async (req, res, next) => {
  console.log('page accessed');
  console.log(req._id);
  try {
    const user = await User.findOne({ '_id': req._id });
    if (!user) {
      console.log('error getting user');
      throw new Error('error getting user');
    } else {
      console.log(req.body)
      const decrypted = await crypt.decrypt(user.encryptionPrivateKey, req.body.clientKey);
      res.status(200).json({
        clientKey: decrypted.message,
        serverKey: user.privateKey
      });

    }
  } catch (err) {
    console.log('error from catch')
    throw new Error('error getting user')
  }

})

module.exports = router;
