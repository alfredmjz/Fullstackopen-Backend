/** @format */

const mongoose = require("mongoose");

if (process.argv.length < 3) {
	console.log(
		"Incorrect arguments: node mongo.js <password> [Optional]:<Entry Name> <Entry Number>"
	);
	process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://alfredmjz:${password}@cluster0.fx7bp.mongodb.net/?retryWrites=true&w=majority`;
const phonebookSchema = {
	name: String,
	number: String,
};
const Entry = mongoose.model("Entry", phonebookSchema);

if (process.argv.length == 3) {
	mongoose
		.connect(url)
		.then((result) => {
			Entry.find({}).then((result) => {
				console.log("phonebook:");
				result.forEach((entry) => {
					console.log(entry.name, entry.number);
				});
				mongoose.connection.close();
			});
		})
		.catch((err) => console.log(err));
} else if (process.argv.length == 5) {
	mongoose
		.connect(url)
		.then((result) => {
			console.log("connected");

			const newNumber = new Entry({
				name: process.argv[3],
				number: process.argv[4],
			});

			return newNumber.save();
		})
		.then(() => {
			console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`);
			return mongoose.connection.close();
		})
		.catch((err) => console.log(err));
}
