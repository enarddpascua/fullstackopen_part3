const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

morgan.token("tae", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(morgan(":method :url :status :response-time ms :tae", "immediate"));

let persons = [
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

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phone has info for ${persons.length} <br/> ${new Date()}</p>`
  );
});

app.get("/api/persons/:id", (request, response) => {
  let id = Number(request.params.id);
  let person = persons.filter((p) => p.id === id);
  if (person.length <= 0) {
    response.status(404).end();
  } else {
    response.json(person[0]);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  let id = Number(request.params.id);
  persons = persons.filter((p) => p.id !== id);
  response.status(204);
});

app.post("/api/persons", (request, response) => {
  let { name, number } = request.body;
  let id = getRandomInt(99);
  let validateIfNameExist = persons.filter((p) => p.name == name);
  if (!name || !number) {
    response.status(400).send({ message: "All fields are required" });
  }

  if (validateIfNameExist.length > 0) {
    response.status(400).send({ message: "name must be unique" });
    return;
  }

  let newPerson = { name, number, id };
  persons = persons.concat(newPerson);
  response.status(200).send(newPerson);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
