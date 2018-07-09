const mongoose = require("mongoose");

mongoose.connect("mongodb://linhtn11:hndsl131108442@ds115971.mlab.com:15971/demo-hapi", { useNewUrlParser: true });
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error"));
/* eslint prefer-arrow-callback: ["error", { "allowNamedFunctions": true }] */
db.once("open", function callback() {
	console.log("Connection with database succeeded.");
});

exports.db = db;
