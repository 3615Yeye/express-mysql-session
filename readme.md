# express-mysql-session

A MySQL session store for express.js



## Installation

Add `express-mysql-session` to your project's `package.json` file:
```
{
  "name": "Your App",
  "dependencies": {
    "express-mysql-session": "latest"
  }
}
```
*It is recommended that you specify a hard-coded version number instead of `latest`*

*See https://npmjs.org/package/express-mysql-session for the latest release version*


Then install it by running the following:
```
npm install
```



## Usage

```
var express = require('express')
var app = module.exports = express()

app.configure(function() {

	var options = {}

	options.db = {}
	options.db.name = 'database_name'
	options.db.user = 'database_user'
	options.db.pass = 'database_pass'
	options.db.options = {}
	options.db.options.host = 'database_host'
	options.db.options.port = 'database_port'
	options.db.options.logging = false// Disables logging in Sequelize
	options.debug = false// Disables console log messages in express-mysql-session

	var SessionStore = require('express-mysql-session')(options, express)

	app.use(express.logger())
	app.use(express.cookieParser())
	app.use(express.bodyParser())

	app.use(express.session({

		key: 'session_cookie_name',
		secret: 'session_cookie_secret',
		store: SessionStore

	}))

})
```



## How to Run Tests

First, you must create a test MySQL database in which to run the tests, with the following connection information:
```
	db_host: 'localhost',
	db_port: 3306,
	db_name: 'session_test',
	db_user: 'session_test',
	db_pass: 'password'
```
*These database credentials are located at `test/config/db.js`*


From your project's base directory:
```
mocha
```
*You may need to run `npm install` locally to get the dev dependencies.*