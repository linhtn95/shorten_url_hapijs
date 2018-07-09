const mongoose = require("mongoose");

mongoose.connect("connect your mongodb here", { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
/* eslint prefer-arrow-callback: ["error", { "allowNamedFunctions": true }] */
db.once("open", function callback() {
	console.log("Connection with database succeeded.");
});

exports.db = db;
