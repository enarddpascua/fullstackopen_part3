const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://enarddpascua:${password}@fullstackopenmongodb.c9l1arn.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
})

const Person = mongoose.model('Person', personSchema)

Person.find({}).then((result) => {
  console.log('Phonebook:')
  result.forEach((contact) => {
    console.log(`${contact?.name} ${contact?.number}`)
  })
  mongoose.connection.close()
})
