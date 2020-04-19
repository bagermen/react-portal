# Quick Start

## Install or Upgrade Node.js and NPM
Visit https://nodejs.org/en/download/ and download and install the latest stable version of node. NPM will be updated with the installl.

```bash
    sudo apt update
    sudo apt upgrade
    sudo apt install nodejs npm
    node -v
```

## Download source code
Create the path to download the source code

```bash
    mkdir -p ~/node/src/bitbucket.org/columbiavidillion
```

Now you have 2 options to get the source code:

* Using HTTPS and your BitBucket user (replace **<USERNAME>** with your own BitBucket username):

```bash
        cd ~/node/src/bitbucket.org/columbiavidillion/
        git clone https://<USERNAME>@bitbucket.org/columbiavidillion/customer-portal.git
```

* Using SSH and access key:
```bash
        ssh-keygen
        cat ~/.ssh/id_rsa.pub

        #Register the access key at BitBucket for this project and then download the source code

        cd ~/node/src/bitbucket.org/columbiavidillion/
        git clone git@bitbucket.org:columbiavidillion/customer-portal.git
```

## Configure
Install all dependencies

```bash
    cd ~/node/src/bitbucket.org/columbiavidillion/customer-portal/
    npm i
    cp config.json.prod config.json
```

## Execute

```bash
    cd ~/node/src/bitbucket.org/columbiavidillion/customer-portal/
    npm start
```

Then open http://localhost:5050 in the browser

## Final Comments
Congrats! you are up and running. Editting any JS file will trigger a hot reload.

Visit http://localhost:5050/docs for more details.

Update `AWS Cognito` credentials into `cognito-credentials.json`.

Update `backend` into `config.json` in root directory.

To build production build run `npm run buildprod`

Thanks!
