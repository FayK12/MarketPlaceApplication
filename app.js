/*
Task: Build the barebones of an online marketplace.

To do this, build a server side web api that can be used to fetch products either one at a time or all at once.

Every product should have a title, price, and inventory_count.

Querying for all products should support passing an argument to only return products with available inventory. 

Products should be able to be "purchased" which should reduce the inventory by 1. Products with no inventory cannot be purchased.

*/ 
/*Node modules used*/
var bodyParser = require("body-parser");
var express = require("express");
var app = express();
const fs = require('fs');
let url = require('url');
let qstring = require('querystring');

/*Note: I'm using a JSON file to persist my marketplace data. 
I'm using as a mocked db here for simplicity. Otherwise, I 
would have used an actual database like mongoDB or mySQL*/
let mockDB; 

//allows express to use the parsed JSON in req.body
app.use(bodyParser.json());

/*
Async file read reads the JSON file with the marketplace products
and parses it into JavaScript Object
@param {string}err - error message
@param {JSON}data - data from products.json
*/
fs.readFile('products.json', (err, data) => {  
	if (err) throw err;
	mockDB = JSON.parse(data);
})

/*
Handle the API GET request
@param {JavaScript object}req - request object
@param {JavaScript object}res - response object
*/
function handleGetRequest (req, res){
	//parse the URL to get the query parameters
	let requestURL = req.url
    let query = url.parse(requestURL).query
	var queryParams = qstring.parse(query)
	//if there are query parameters, continue into the 'if' analysis 
	if(Object.keys(queryParams).length > 0){
		//the query parameter has to be inventory=true to be able to see inventory items
		if (queryParams.inventory === "true"){
			//declare an array for storing products with inventory > 0
			let availableProds = [];
			//Get products from database
			let products = mockDB.products; 
			//Iterate over all products
			for (let product in products) {
				//if count > 0, product is added to the the availableProds array 
				if (products[product].inventory_count > 0) {
					availableProds.push(products[product]);
				}
			}
			res.send(availableProds);
		}
		//if the query parameter is anything other than inventory=true
		else{
			res.send("Query Not Found. To see the list of inventory items, use API: GET http://localhost:3000/api/list?inventory=true");
		}
	}//what to do if there are no query params
	else {	
		console.log(mockDB.totalProducts);
		res.send(mockDB);
	}
}

/*
Handle the API PUT request
@param {JavaScript object}req - request object
@param {JavaScript object}res - response object
*/
function handlePutRequest (req, res) {
	//parse the URL to get the product id
	//Note: typically, this is not a good idea because data isn't secure when passed as a hyperlink
	//product id's should not be passed in the URL. However, in the interest of time, this was a workaround 
	var id = req.params.id;
	//var to make note of the inventory count for the product being purchased
	var currentCount = mockDB.products[id]["inventory_count"];
	//for products that are available, reduce their count by 1
	if (currentCount > 0) {
		mockDB.products[id]["inventory_count"]--; 
	}
	//if the product isn't available, send a message
	else {
		res.send("Item is out of stock. Please try later");
	}
	//function call which persists the inventory changes by writing to the JSON file
	updateDB(mockDB);
}

/*
Persists the inventory changes by writing to the JSON file
@param {JavaScript object}mockDB - all products with their title, price, inventory_count
*/
function updateDB(mockDB){
	let updatedDB = JSON.stringify(mockDB); 
	//async write method to write to the JSON file
	fs.writeFile('products.json', updatedDB, (err) => {  
		if (err) throw err;
		console.log('Data written to file');
	});
}

//route to 'home page'
app.get("/", (req, res, next) => {
	res.write("Welcome to the Amazonian Marketplace - your one stop shop for everything (even Shawarma)")
	res.write("\n");
	res.write("\n");
	res.write("These are the APIs to use:");
	res.write("\n");
	res.write("\n");
	res.write("For all products: 				GET http://localhost:3000/api/list");
	res.write("\n");
	res.write("For available inventory items: 			GET http://localhost:3000/api/list?inventory=true");
	res.write("\n");
	res.write("To make a purchase, use the product's id: 	PUT http://localhost:3000/api/products/:id");
	res.write("\n");
	res.write("You'll notice its inventory_count changes if you get all the products again");
	res.write("\n");
	res.write("Out of stock items can't be purchased");
	res.write("\n");
	res.write("\n");
	res.end();
});

//route to product list
app.get("/api/list", (req, res, next) => {
 handleGetRequest(req, res);
});

//route to purchase an item
app.put("/api/products/:id", (req, res, next) => { 
 handlePutRequest(req, res);
});

//port where server is listening
app.listen(3000, () => { 
 console.log("Server is running on port 3000. ");
});
