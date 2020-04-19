## Installation steps for dev environment

Server: AWS LightSail - Vidtizer-Frontend - 3.210.174.74 - customer-dev.vidtizer.com
Date: 2019-04-05

Installing NodeJS:

```bash
    sudo apt update
    sudo apt upgrade
    sudo apt install nodejs npm
    node -v
```

Downloading source code

```bash
    mkdir -p ~/node/src/bitbucket.org/columbiavidillion
    ssh-keygen
    cat ~/.ssh/id_rsa.pub

    #Register the access key at BitBucket for this project and then download the source code

    cd ~/node/src/bitbucket.org/columbiavidillion/
    git clone --branch dev git@bitbucket.org:columbiavidillion/customer-portal.git
```

Configuring the service

```bash
    cd ~/node/src/bitbucket.org/columbiavidillion/customer-portal/
    npm i
    cp config.json.prod config.json
    npm run buildprod
```

Copy vidtizer.com certificate into `/etc/ssl/`

```bash
    sudo mkdir /etc/ssl/vidillion
    # copy certificates inside that folder:
    #    vidtizer.key
    #    vidtizer.crt
    #    vidtizer_ca-bundle.crt
```

Configuring Apache2:

```bash
    sudo apt install apache2
    sudo nano /etc/apache2/sites-enabled/customer.vidtizer.conf
```

```
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    ServerName  customer-dev.vidtizer.com
    DocumentRoot /home/ubuntu/node/src/bitbucket.org/columbiavidillion/customer-portal
    DirectoryIndex prod.html

    <Directory "/home/ubuntu/node/src/bitbucket.org/columbiavidillion/customer-portal">
        RewriteEngine on
        # Don't rewrite files or directories
        RewriteCond %{REQUEST_FILENAME} -f [OR]
        RewriteCond %{REQUEST_FILENAME} -d
        RewriteRule ^ - [L]
        # Rewrite everything else to index.html to allow html5 state links
        RewriteRule ^ prod.html [L]

        Require all granted
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/customer_vidtizer_error.log
    CustomLog ${APACHE_LOG_DIR}/customer_vidtizer_access.log combined
</VirtualHost>
<VirtualHost *:443>
    ServerAdmin webmaster@localhost
    ServerName  customer-dev.vidtizer.com
    DocumentRoot /home/ubuntu/node/src/bitbucket.org/columbiavidillion/customer-portal
    DirectoryIndex prod.html

    <Directory "/home/ubuntu/node/src/bitbucket.org/columbiavidillion/customer-portal">
        RewriteEngine on
        # Don't rewrite files or directories
        RewriteCond %{REQUEST_FILENAME} -f [OR]
        RewriteCond %{REQUEST_FILENAME} -d
        RewriteRule ^ - [L]
        # Rewrite everything else to index.html to allow html5 state links
        RewriteRule ^ prod.html [L]

        Require all granted
    </Directory>

    SSLEngine On
    SSLCertificateKeyFile /etc/ssl/vidillion/vidtizer.key
    SSLCertificateFile /etc/ssl/vidillion/vidtizer.crt
    SSLCertificateChainFile /etc/ssl/vidillion/vidtizer_ca-bundle.crt

    <FilesMatch "\.(cgi|shtml|phtml|php)$">
        SSLOptions +StdEnvVars
    </FilesMatch>

    BrowserMatch "MSIE [2-6]" \
        nokeepalive ssl-unclean-shutdown \
        downgrade-1.0 force-response-1.0
    BrowserMatch "MSIE [17-9]" ssl-unclean-shutdown

    ErrorLog ${APACHE_LOG_DIR}/customer_vidtizer_error.log
    CustomLog ${APACHE_LOG_DIR}/customer_vidtizer_access.log combined
</VirtualHost>
```

```bash
    sudo a2enmod rewrite ssl
    sudo a2ensite customer.vidtizer.conf
    sudo a2dissite 000-default.conf
    sudo service apache2 restart
```

http://customer-dev.vidtizer.com/
