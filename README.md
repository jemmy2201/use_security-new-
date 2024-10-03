This is a USE Portal Application

## Setup



```bash

git clone https://use-security@github.com/use-security/use-portal.git 

npm install

npm i sass

```

Open [http://localhost](http://localhost:3000) with your browser to see the login page.



## Mockpass

We are using mockpass in local to test. In UAT and production it will connect to actual Singpass.

### Setup mockpass 

```bash 
npm install @opengovsg/mockpass

set SHOW_LOGIN_PAGE=true
set MOCKPASS_NRIC=S8979373D
set SP_RP_JWKS_ENDPOINT=http://localhost/api/jwks

```


## Deploy 


