const express = require("express")
const redis = require("redis")
const colors = require("colors/safe")
const morgan = require("morgan")
const favicon = require("serve-favicon")
const http = require("http")

const NODE_ENV = process.env.NODE_ENV || "development"

const PORT = process.env.PORT || 4560
const HOST = process.env.HOST || "0.0.0.0"

const app = express()
const server = http.createServer(app)

if (NODE_ENV == "development") {
	require("./config/keys.js")
	app.use(morgan("dev", {}))

} else {
	app.use(morgan("combined", {}))
}

const client = redis.createClient(process.env.REDIS_SERVER)

client.on("connect", function () {
	console.log(colors.green("Connection to the Redis Server established"))
})

client.on("error", function () {
	console.log(colors.red("Error occured in the redis connection"))
})

// socketio init
var io = require("./socket/io")(server, client)

app.disable("etag")
app.use(favicon(__dirname + "/assets/favicon.ico"))

// static middlewares
app.use("/", express.static(__dirname + "/public"))
app.use("/assets", express.static(__dirname + "/assets"))

// server middleware
app.use("/server", require("./routes/server")(client, io))


app.use(function (req, res, next) {
	res
		.status(404)
		.send("NOT FOUND!")
})

app.use(function (error, req, res, next) {
	res
		.status(500)
		.send("ERROR OCCURED! If you are a developer logs for more details!")

	console.error(error)
})


server.listen(PORT, HOST, function (error) {
	if (!error) {
		console.log(colors.green("Server is listening on PORT: " + PORT + " HOST: " + HOST))
	}
	else {
		console.error(colors.red("Error occured while listening to server"))
		throw error
	}
})

