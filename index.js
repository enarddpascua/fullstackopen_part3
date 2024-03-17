const express = require("express");
require("dotenv").config();
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./model/Person");

morgan.token("tae", (req, res) => {
  return JSON.stringify(req.body);
});

app.use(express.static("dist"));
app.use(express.json());
app.use(cors());
app.use(morgan(":method :url :status :response-time ms :tae", "immediate"));

app.get("/api/persons", (request, response) => {
  Person.find({}).then((person) => {
    response.json(person);
  });
});

app.get("/api/info", (request, response) => {
  Person.countDocuments({}).then((number) => {
    response.send(`<p>Phone has info for ${number} <br/> ${new Date()}</p>`);
  });
});

app.get("/api/persons/:id", (request, response) => {
  console.log(request.params.id, typeof request.params.id);
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person);
    })
    .catch((err) => {
      response.status(404).end();
    });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/api/persons", (request, response) => {
  Person.create(request.body).then((res) => {
    response.json(res).status(200).end();
  });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
