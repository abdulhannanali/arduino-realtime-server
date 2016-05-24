const express = require("express")
const mainSchema = require("../schemas/mainSchema")


module.exports = function (redisClient, io) {
	var hmName = "arduino"

	if (!redisClient) {
		throw new Error("redisClient not provided")
	}

	const router = express.Router()

	router.get("/", function (req, res, next) {
		var hmArray = []

		Object.keys(req.query).forEach(function (value, index, array) {
			if (mainSchema.hasOwnProperty(value)) {
				hmArray.push(value)
				hmArray.push(req.query[value])
			}
		})

		if (hmArray[0]) {
			redisClient.hmset("arduino", hmArray, function (error, response) {
				if (!error && response == "OK") {
					io.resend()
					res.send("STORED!")
				}
				else if (error) {
					next(error)
				}
				else {
					next()
				}
			})
		}
		else {
			res.send("NOTHING STORED!")
		}

	})

	router.get("/getall", function (req, res, next) {
		redisClient.hgetall(hmName, function (error, response) {
			if (error) {
				next(error)
			}
			else if (response) {
				res.json(response)
			}
			else {
				next()
			}
		})
	})

	router.get("/get", function (req, res, next) {
		var hKeys = Object.keys(req.query)
			.map(function (value) {
				return value 
			})

		var hObj = {}

		redisClient.hmget(hmName, hKeys, function (error, response) {
			if (error) {
				next(error)
			}
			else if (response) {
				response.forEach(function (value, index, array) {
					hObj[hKeys[index]] = value
				})

				res.json(hObj)
			}
			else {
				next()
			}
		})
	})

	return router
}