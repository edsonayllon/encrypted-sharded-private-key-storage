# sharded keys

## 1 | Description

Stores one private key in shards, encrypting each on separate hosts.

## 2 | Roadmap

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
  - [ ] dencrypt key
    - [ ] send encrypted client shard to server
    - [ ] unencrypt client shard in server
    - [ ] send client shard and server shard to client
    - [ ] unencrypt server shard in client
