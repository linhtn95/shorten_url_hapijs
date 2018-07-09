const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const URLSchema = new Schema({
	originalURL: String,
	shortURL: String,
	urlCode: String,
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	updatedAt: {
		type: Date,
		default: Date.now(),
	},
});

module.exports = mongoose.model("URL", URLSchema);
