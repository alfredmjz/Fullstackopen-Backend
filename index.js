/** @format */
require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const People = require("./people.js");
const app = express();

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(
	express.static("build"),
	express.json(),
	cors(),
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// const generateID = () => {
// 	if (People.length === 10000) {
// 		console.log("Maximum ID reached");
// 		return;
// 	}

// 	let newID = 0;
// 	while (findID(newID)) {
// 		newID = Math.floor(Math.random() * (10000 - 2) + 1);
// 	}

// 	return newID;
// };

app.get("/api/persons", (req, res) => {
	People.find({}).then((person) => {
		res.json(person);
	});
});

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const exist = People.findById(id);
	if (!exist) res.status(404).end(`ID ${id} does not exist`);
	exist.then((person) => {
		res.json(person);
	});
});

//Error - ID data type is wrong
app.delete("/api/persons/:id", (req, res) => {
	const id = req.params.id;
	const exist = People.findById(id);
	exist.then((person) => {
		if (!exist) res.status(404).end(`ID ${id} does not exist`);

		People.deleteOne(person).then((result) => {
			if (result.ok === 1) {
				res.status(204).send("successfully deleted");
			}
		});
	});
});

app.post("/api/persons", (req, res) => {
	const id = req.body.id;
	const name = req.body.name;
	const number = req.body.number;
	if (!name) {
		return res.status(400).json({
			error: "name missing",
		});
	}
	if (name.toLowerCase() === name.toUpperCase()) {
		return res.status(400).json({
			error: "name must not contain numbers",
		});
	}
	if (!number) {
		return res.status(400).json({
			error: "number missing",
		});
	}

	People.findOne({ name: name }).then((result) => {
		if (result) {
			return res.status(400).json({ error: "name must be unique" });
		} else {
			const newPerson = new People({
				id: id,
				name: name,
				number: number,
			});

			newPerson.save().then((saved) => {
				res.json(saved);
			});
		}
	});
});

app.get("/info", (req, res) => {
	const date = new Date();
	const data = People.find({});
	data.then((person) => {
		const message = `Phonebook has info for ${person.length} people` + "<br/>" + date;
		res.send(message);
	});
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
