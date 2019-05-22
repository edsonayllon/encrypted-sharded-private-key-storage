const express = require('express');
const router = express.Router();
var RSA = require('hybrid-crypto-js').RSA;
var Crypt = require('hybrid-crypto-js').Crypt;
const userService = require('../services/user.service');

var crypt = new Crypt();
var rsa = new RSA();

router.post('/', async (req, res, next) => {
  rsa.generateKeypair(async (keypair) => {
    // captures generated encryption key pairing for client key encryption
    var encryptionPublicKey = await keypair.publicKey;
    var encryptionPrivateKey = await keypair.privateKey;

    // encrypts client shard for client storage
    var encrypted = crypt.encrypt(encryptionPublicKey, req.body.clientKey);

    try {
      // store server shard and encryption keys
      const stored = await userService.storePrivateKey(
        req._id,
        req.body.serverKey,
        encryptionPublicKey,
        encryptionPrivateKey
      );
      console.log(stored);

      // send encrypted data to client
      if (stored) {
        res.status(200).json({
          clientKey: encrypted
        });
      }
    } catch (err) {
      console.log(err);
    }
  });
})

module.exports = router;
