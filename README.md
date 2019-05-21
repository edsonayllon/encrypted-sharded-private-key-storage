# sharded keys

## 1 | Description

Stores one private key in shards, encrypting each on separate hosts.

## 2 | Roadmap

- [x] unencrypted storage of private key
  - [x] Store in client local local storage
  - [x] Store in server
- [ ] encrypted storage of private key
  - [ ] encrypt server key in client
    - [ ] encrypt in client
    - [ ] store private key in client
    - [ ] send encrypted key to server for storage
