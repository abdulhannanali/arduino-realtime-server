$(document).ready(function () {
	var socket = io()
	var panelIds = {}
	var valueTable = $("#valueTable")
	var valueTemplate = $("#valueTemplate").html().trim()
	var connectionStatus = $("#connectionStatus")

	var valueStore = {}

	socket.on('connect', function () {
		console.log("Connected to socket!")
		connectionStatus.text("Connected!")
		connectionStatus.attr("class", "text-success")

		socket.emit("get_data")

		socket.on("response_data", function (data) {
			if (!data) {
				return
			}

			var templates = Object.keys(data).map(function (key) {
				return valueTemplate.replace(/KEY/, key).replace(/VALUE/, data[key])
			})
			valueTable.empty()
			valueTable.append(templates)
			
			valueStore[new Date()] = data
		})




	})

	socket.on("connect_error", function (error) {
		connectionStatus.text("Not Connected!")
		connectionStatus.attr("class", "text-danger")
	})

	$("#refreshValues").click(function (event) {
		socket.emit("get_data")
	})


})
