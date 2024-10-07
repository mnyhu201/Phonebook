const mongoose = require('mongoose')

// invalid number of arguments
if(process.argv.length > 5){ 
  console.log('too many arguments')
  process.exit(1)
} else if(process.argv.length > 3 && process.argv.length != 5){
  console.log('invalid number of arguments')
  process.exit(1)
}
if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://mnyhu201:${password}@cluster0.khib9.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if(process.argv.length == 5){ // adding 
  const contact = new Contact({
    name: process.argv[3],
    number: process.argv[4],
  })

  contact.save()
    .then(result => {
      console.log(`added ${contact.name} number ${contact.number} to phonebook`)
      mongoose.connection.close()
    })
} 

// display otherwise
if(process.argv.length == 3){ 
  console.log("phonebook: ")
  Contact.find({})
    .then(result => {
      result.forEach(contact => {
        console.log(`${contact.name} ${contact.number}`)
      })
      mongoose.connection.close()
    })
}




// note.save().then(result => {
//   console.log('note saved!')
//   mongoose.connection.close()
// })