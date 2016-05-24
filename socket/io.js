const colors = require("colors/safe")
const mainSchema = require("../schemas/mainSchema")

module.exports = function (server, redisClient) {
	if (!redisClient) {
		throw new Error("Essential redis client not provided.")
	}

	var io = require("socket.io")(server)


	io.on("connection", function (socket) {
		console.log(colors.blue("Incoming socket!"))

		socket.on("get_data", function (from, data) {
			redisClient.hgetall("arduino", function (error, response) {
				if (error) {
					socket.emit("error", error)
				}
				else if (response) {
					socket.emit("response_data", populateResponse(response))
				}
			})
		})


	})

	io.resend = function () {
		redisClient.hgetall("arduino", function (error, response) {
			if (response) {
				io.emit("response_data", populateResponse(response))
			}
		})
	}


	function populateResponse (response) {
		var obj = {}
		Object.keys(response).forEach(function (value) {
			obj[mainSchema[value]] = response[value]
 		})

 		return obj
	}

	

	return io
}