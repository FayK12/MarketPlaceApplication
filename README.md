# ShopifyApplication

### Prerequisites
* You'll need to install the latest stable release of Node.js and npm. 
* Check out https://nodejs.org/ to download. 
* Follow the installation steps.
* Once setup, launch command prompt and confirm via the following commands
```
node -v 
```
Node was v8.11.4 for me 
```
npm -v 
``` 
NPM was v6.4.1 for me

### Setup
* Create a folder on your desktop. Download the repo here & unzip the contents: https://github.com/FayK12/ShopifyApplication
* Delete the node modules folder
* Open command prompt and navigate to the folder with the unzipped contents
* Enter the command 
```
npm install
```
This does a local install of the node modules you'll need based on the package.json file.

* Enter the command 
```
node app.js
```
This starts the server at http://localhost:3000/

### Marketplace How To's
* For all products: 				        GET http://localhost:3000/api/list
* For available inventory items: 	GET http://localhost:3000/api/list?inventory=true
* To make a purchase, use its id: 	PUT http://localhost:3000/api/products/id_1
* Revisit http://localhost:3000/api/list and you'll notice the inventory count has decreased by 1
* You're unable to purchase an out of stock item or enough purchases reduce its inventory to 0

