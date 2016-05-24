$(document).ready(function () {
	var socket = io()
	var valueTable = $("#valueTable")
	var valuePanels = $("#valuePanels")
	var connectionStatus = $("#connectionStatus")
	var lastUpdated = $("#lastUpdated")
	var clearLogBtn = $("#clearLogBtn")

	var valueTemplate = $("#valueTemplate").html().trim().replace(/\n/g, "")
	var logTemplate = $("#logTemplate").html().trim().replace(/\n/g, "")

	var valuesLogger = $("#valuesLogger")
	var logTableBody = $("#logTableBody")

	var storeName = "logStoreArduino"

	socket.on('connect', function () {
		console.log("Connected to socket!")
		connectionStatus.text("Connected!")
		connectionStatus.attr("class", "text-success")

		socket.emit("get_data")

		socket.on("response_data", function (data) {
			if (!data) {
				return
			}
			var date = new Date()

			var templates = Object.keys(data).map(function (key) {
				return valueTemplate.replace(/KEY/, key).replace(/VALUE/, data[key])
			})
			valueTable.empty()
			valueTable.append(templates)

			valuePanels.show() 
			lastUpdated.html("Last updated values at: " + "<b>" +  date + "</b>")
			lastUpdated.show()
			
			valuesLogger.show()
			logData(date, data)
		})


	})

	socket.on("connect_error", function (error) {
		connectionStatus.text("Not Connected!")
		connectionStatus.attr("class", "text-danger")
	})

	socket.on("disconnect", function () {
		console.log("Socket Disconnected!")
		connectionStatus.text("Disconnected")
		connectionStatus.attr("class", "text-danger")
	})

	socket.on("empty_data", function () {
		$("#valueTable").empty()
		$("#valueTable")
			.append($("<h1></h1>")
			.text("Sorry! There's no data to display right now!")
			.addClass("text-danger"))
	})

	$("#refreshValues").click(function (event) {
		socket.emit("get_data")
	})

	$("#disconnectBtn").click(function (event) {
		console.log("Disconnect")
		socket.disconnect()
	})

	$("#clearBtn").click(function (event) {
		socket.emit("clear_data")
	})

	clearLogBtn.click(function (event) {
		logTableBody.empty()
	})

	function populateLog() {
		var logData = Object.keys(data).map(function (value, index, array) {

		})
	}

	function logData (date, data) {
		var keys = Object.keys(data).join(", ")
		var logRow = $(logTemplate
						.replace("KEYS", keys)
						.replace("DATE", date))

		logRow.click(function () {
			alert(JSON.stringify(data, null, 4))
		})

		logTableBody.prepend(logRow)

	}

})
