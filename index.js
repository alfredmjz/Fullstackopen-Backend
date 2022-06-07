/** @format */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middlewares/error.js");
const morgan = require("morgan");
const People = require("./people.js");

const app = express();

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(
	express.static("build"),
	express.json(),
	cors(),
	errorHandler,
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

app.get("/api/persons", (req, res, next) => {
	People.find({})
		.then((person) => {
			res.json(person);
		})
		.catch((err) => next(err));
});

app.get("/api/persons/:id", (req, res, next) => {
	const id = req.params.id;
	People.findById(id)
		.then((person) => {
			if (!person) res.status(404).end(`ID ${id} does not exist`);
			else res.json(person);
		})
		.catch((err) => next(err));
});

//Error - ID data type is wrong
app.delete("/api/persons/:id", (req, res, next) => {
	const id = req.params.id;
	People.findByIdAndDelete(id)
		.then((result) => {
			if (!result) res.status(404).end(`ID ${id} does not exist`);
			else res.status(204).send("successfully deleted");
		})
		.catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
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

	People.findOne({ name: name })
		.then((result) => {
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
		})
		.catch((err) => next(err));
});

app.get("/info", (req, res, next) => {
	const date = new Date();
	People.find({})
		.then((person) => {
			const message = `Phonebook has info for ${person.length} people` + "<br/>" + date;
			res.send(message);
		})
		.catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
	const targetName = req.body.name;
	const newNumber = req.body.number;
	People.findOneAndUpdate({ name: targetName }, { number: newNumber }, { new: true })
		.then((update) => {
			res.json(update);
		})
		.catch((err) => next(err));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
