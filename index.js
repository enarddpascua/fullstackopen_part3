const express = require('express')
require('dotenv').config()
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('tae', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :response-time ms :tae', 'immediate'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then((person) => {
    response.json(person)
  })
})

app.get('/api/info', (request, response) => {
  Person.countDocuments({}).then((number) => {
    response.send(`<p>Phone has info for ${number} <br/> ${new Date()}</p>`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  console.log(request.params.id, typeof request.params.id)
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch((err) => {
      next(err)
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch((err) => {
      console.log(err)
    })
})

app.post('/api/persons', (request, response, next) => {
  Person.create(request.body)
    .then((res) => {
      response.json(res).status(200).end()
    })
    .catch((err) => next(err))
})

app.put('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndUpdate(
    request.params.id,
    {
      number: request.body.number,
    },
    { new: true }
  )
    .then((res) => {
      response.json(res)
    })
    .catch((err) => next(err))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
