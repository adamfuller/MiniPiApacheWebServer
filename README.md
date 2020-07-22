# MiniPiApacheWebServer
Apache2 Webserver comprised of numerous personal projects and tools/utilites.

This webserver updates automatically whenever a push to this repo is completed.

## Project Status

### TODO:
- [ ] Change the UI to use React
- - [ ] Integrate P5 graphics with React
- - [ ] Integrate Canvas graphics with React
- [ ] Implement tools in a single API
- - [ ] Decide on language/framework for API (Go, Node.js, Python)
- - [ ] Migrate php scripts to the API
- [ ] Make general purpose SQL API
- [ ] Purge items that no longer work
- - [ ] Remove access of to-be purged items from website
- - [ ] Remove files from github


### TODONE:
- [x] Add setup script

## Installation and Setup

### Installing the server
Clone the repo

`git clone http://www.github.com/adamfuller/MiniPiApacheWebServer`

Run the setup script (This will clone the repo as the server's files)

`./setup.sh`

Visit the website

`localhost:80` or `octalbyte.com`

### Allowing remote SSH

The following should be done on the computer you will be using to connect to the web-server.

Generate a new SSH key

`ssh-keygen`

You will be prompted for the file location, press `enter` to use the default

You will be prompted to enter a passphrase to encrypt the key, press `enter` to leave it blank

View the public key

`cat ~/.ssh/id_rsa.pub`

If you get `cat: ~/.ssh/id_rsa.pub: No such file or directory` the key was not generated

Send the key to the device hosting the server, you will need the host's password

`ssh-copy-id {HOST}@{IPADDRESS}`

Now connect to the host

`ssh {HOST}@{IPADDRESS}`

You should now be connected

NOTE: If you are on macOS and this is the first time you have connected, you will be prompted

```
The authenticity of host '[{HOST}]:{PORT} ([{IPADDRESS}]:{PORT})' can't be established.

ECDSA key fingerprint is SHA256:{SOME_STRING}.

Are you sure you want to continue connecting (yes/no/[fingerprint])? 
```

Type `yes` then hit `enter` and you should be connected
