/** @format */

const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
	.connect(url, { dbName: "Phonebook" })
	.then(() => {
		console.log("connected to MongoDB");
	})
	.catch((error) => {
		console.log("error connecting to MongoDB:", error.message);
	});

const phonebookSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: [true, "A name is required"],
	},
	number: {
		type: String,
		validate: {
			validator: function (str) {
				let count = {
					l: 0,
					current: 0,
					dash: 0,
				};

				for (let s of str) {
					if (s === "-") {
						count.l = count.current;
						count.dash += 1;
						continue;
					}
					if (count.dash > 1) {
						return false;
					}
					count.current += 1;
				}
				return count.dash === 1 && count.l <= 3 && count.current >= 8;
			},
			message: "Number is an invalid phone number",
		},
		required: [true, "A number is required"],
	},
});

phonebookSchema.set("toJSON", {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString();
		delete returnedObject._id;
		delete returnedObject.__v;
	},
});

module.exports = mongoose.model("Entry", phonebookSchema);
