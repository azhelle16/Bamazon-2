/*
 #######################################################################
 #
 #  FUNCTION NAME : 
 #  AUTHOR        : 
 #  DATE          : 
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : 
 #  PARAMETERS    : 
 #
 #######################################################################
*/

//PACKAGES
var inq = require("inquirer")
var inq2 = inq
var mysql = require("mysql")
const Table = require('cli-table');

//GLOBAL VARIABLES
var con //to be used for MySQL
var prodIdArr = {} //to store the ids of the items
var prodPriceArr = {} //to store the prices of the items

/*
 #######################################################################
 #
 #  FUNCTION NAME : connectSQL
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : connects to the SQL database
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function connectSQL() {

	con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "password",
	  database: "bamazon"
	});

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : showWelcome
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : shows welcome sign
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function showWelcome() {

	const table = new Table({
	  chars: { 'top': '═' , 'top-mid': '' , 'top-left': '╔' , 'top-right': '╗'
	         , 'bottom': '═' , 'bottom-mid': '' , 'bottom-left': '╚' , 'bottom-right': '╝'
	         , 'left': '║' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
	         , 'right': '║' , 'right-mid': '' , 'middle': '' },
	  colWidths: [45],
	  style: {"padding-left":6,"padding-right":4}

	});

	table.push(
	    [""],
	    ["W E L C O M E  T O  B A M A Z O N"],
	    [""]
	);

	console.log(table.toString());

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : showMenu
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : shows the product details
 #  PARAMETERS    : flag
 #
 #######################################################################
*/

function showMenu(flag) {

	var sql = ""
	const prod_table = new Table({
	  chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
	         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
	         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
	         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' },
	  head: ["ID","PRODUCTS","PRICE","STOCK"],
	  style: { head:['magenta'] },
	  colWidths: [5,50,15,10]
	});

	switch (flag) {
		case 0:
			sql = "SELECT id, products_name, price, stock_in_quantity FROM products"
		break;
		case 1: 
			sql = "SELECT id, products_name, price, stock_in_quantity FROM products WHERE stock_in_quantity < 5"
		break;
	}
	
	con.query(sql, function (err, result, fields) {
		if (err) throw err
		if (result.length == 0) {
			console.log("\n\nNo products stored in the database. Please insert data to proceed.\n")
		} else {
				for (var p = 0; p < result.length; p++) {
					prod_table.push(
					    [result[p].id, result[p].products_name, '$'+result[p].price,result[p].stock_in_quantity]
					);
					if (flag == 0) {	
						prodIdArr[result[p].id] = result[p].stock_in_quantity
						prodPriceArr[result[p].id] = result[p].price
					}
				}
				console.log(prod_table.toString());
				con.end()
		  }
	});

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : main
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : main program
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function main() {

	showWelcome()
	// connectSQL()
	// showMenu(0)
	// setTimeout(function() {
	promptUser()
	//},500)

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : promptUser
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : asks user whether to make a purchase or end access
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function promptUser() {

	inq
      	.prompt([
	        {
	          type: "list",
	          message: "What would you like to do?",
	          choices: ["View Products For Sale","View Low Inventory","Add To Inventory","Add New Product","Exit Bamazon"],
	          name: "contents"
	        }
      	])
      	.then(function(res) {
        
	  		switch (res.contents.toLowerCase()) {
	  			case "view low inventory":
	  				connectSQL()
					showMenu(1)
					setTimeout(function() {
						promptUser()
					},500)
	  			break;
	  			case "view products for sale":
	  				connectSQL()
					showMenu(0)
					setTimeout(function() {
						promptUser()
					},500)
	  			break;
	  			case "exit bamazon":
	  				//exit()
	  				console.log("\nThank you for using Bamazon. Have A Good Day!\n")
	  			break;
	  			case "add to inventory":
	  				connectSQL()
					showMenu(0)
					setTimeout(function() {
	  					addItems()
	  				},500);
	  			break;
	  			case "add new product":
	  				addNewProduct()
	  			break;
	  		}


      	});

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : addItems
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : asks the user to add items in the inventory
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function addItems() {

	inq2
      	.prompt([
	        {
	          type: "input",
	          message: "Please provide the item ID:",
	          name: "itemID",
	          validate: function(ch) {

	          	if(prodIdArr[ch])
	          		return true

	          }
	        },
	        {
	          type: "input",
	          message: "How many would you like to add?",
	          name: "itemCnt",
	          validate: function(num) {

	          	var reg = /^\d+$/;
	          	if (reg.test(num)) {
	          		if (parseInt(num) > 0)
	          			return true
	          	}

	          }
	        }
      	])
      	.then(function(res) {
	  			
  			inq2
  				.prompt([
	  				{
	  					type: "confirm",
				        message: "Would you like to continue?",
				        name: "confirm",
				        default: true    
	  				}
  				])
  				.then(function(r) {

  					if (r.confirm) {
  						connectSQL()
			  			setTimeout(function() {
			  				updateDatabase(res.itemID,res.itemCnt)
			  			},500)
  					} else {
  						console.log("\nThank you for using Bamazon. Have A Good Day!\n")
  					  }

  				})

      	});

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : updateDatabase
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : updates the database with the new information
 #  PARAMETERS    : id, quantity
 #
 #######################################################################
*/

function updateDatabase(id,num) {

	var newcnt = parseInt(prodIdArr[id]) + parseInt(num)
	var sql = "UPDATE products SET stock_in_quantity="+parseInt(newcnt)+" WHERE id="+id
	con.query(sql, function (err, result, fields) {
		if (err) throw err
		console.log("\nDatabase Updated\n")
		showMenu(0)
		setTimeout(function() {
			promptUser()
		},500)
	})

}

/*
 #######################################################################
 #
 #  FUNCTION NAME : addNewProduct
 #  AUTHOR        : Maricel Louise Sumulong
 #  DATE          : March 20, 2019 PDT
 #  MODIFIED BY   : 
 #  REVISION DATE : 
 #  REVISION #    : 
 #  DESCRIPTION   : asks user for new product information
 #  PARAMETERS    : none
 #
 #######################################################################
*/

function addNewProduct() {

	inq
      	.prompt([
	        {
	          type: "input",
	          message: "Please provide the name of the product:",
	          name: "name"
	        },
	        {
	          type: "input",
	          message: "Please provide the department of the product:",
	          name: "department"
	        },
	        {
	          type: "input",
	          message: "Please provide number of products in the stock:",
	          name: "number",
	          validate: function(num) {

	          	var reg = /^\d+$/;
	          	if (reg.test(num)) {
	          		if (parseInt(num) > 0)
	          			return true
	          	}

	          }
	        },
	        {
	          type: "input",
	          message: "Please provide price of the product:",
	          name: "price"
	        }

      	])
      	.then(function(res) {
        
        	var n = res.name
        	var d = res.department
        	var s = res.number
        	var p = parseFloat(res.price).toFixed(2)
	  		var sql = "INSERT INTO products (products_name,department_name,price,stock_in_quantity) VALUES ('"+n+"','"+d+"',"+p+","+s+")"
	  		// console.log(sql)
	  		connectSQL()
	  		setTimeout(function() {
				con.query(sql, function (err, result, fields) {
					if (err) throw err
					console.log("\nRow Created\n")
					showMenu(0)
					setTimeout(function() {
						promptUser()
					},500)
				})
			},500)
      	});

}

/* FUNCTION CALL */
main()


