---
author: Edson Ayllon
category: functionality
tags:
- EOSIO
- React
- Node
- Express
- Encryption
status: complete
twitter: https://twitter.com/relativeread
---

## Modular 13-2019

# Encrypted Sharded Private Key Storage

Stores one private key in shards, encrypting each on separate hosts. The string to decrypt a shard is stored on another host, and is randomly generated. 

## 1. Roadmap

- [x] unencrypted storage of private key
  - [x] Shard private key
  - [x] Store in client local local storage
  - [x] Store in server
- [x] encrypted storage of private key
  - [x] encrypt server key in client
    - [x] encrypt in client
    - [x] store server encryption keys in client
    - [x] send encrypted key to server for storage
  - [x] encrypt client key in server
    - [x] receive private key shard from client
    - [x] store server key shard
    - [x] encrypt client key shard
    - [x] save client encryption keys
    - [x] send encrypted shard to client
  - [x] store key shards
    - [x] store server key shard
    - [x] store client key shard
  - [x] dencrypt key
    - [x] send encrypted client shard to server
    - [x] unencrypt client shard in server
    - [x] send client shard and server shard to client
    - [x] unencrypt server shard in client
