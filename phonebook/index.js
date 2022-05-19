/** @format */

const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(
	express.json(),
	morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

let people = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

const generateID = () => {
	if (people.length === 10000) {
		console.log("Maximum ID reached");
		return;
	}

	let newID = 0;
	while (findID(newID)) {
		newID = Math.floor(Math.random() * (10000 - 2) + 1);
	}

	return newID;
};

const findID = (id) => {
	return people.find((person) => person.id === id);
};

const findName = (name) => {
	return people.find((person) => person.name === name);
};

app.get("/api/persons", (req, res) => {
	res.json(people);
});

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const exist = findID(id);
	if (!exist) res.status(404).end(`ID ${id} does not exist`);
	res.json(exist);
});

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const exist = findID(id);
	if (!exist) res.status(404).end(`ID ${id} does not exist`);
	people = people.filter((person) => person.id !== id);
	res.status(204).send("successfully deleted");
});

app.post("/api/persons", (req, res) => {
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

	const exist = findName(name);
	if (exist) return res.status(400).json({ error: "name must be unique" });

	const newPerson = {
		id: generateID(),
		name: name,
		number: number,
	};
	people = people.concat(newPerson);
	res.json(newPerson);

	morgan.token("body", (req) => JSON.stringify(req.body));
});

app.get("/info", (req, res) => {
	const date = new Date();
	const message = `Phonebook has info for ${people.length} people` + "<br/>" + date;
	res.send(message);
});
const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
