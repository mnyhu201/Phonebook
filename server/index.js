const express = require('express')
const app = express()
const morgan = require('morgan');  // Import morgan
const cors = require('cors') // use cors to prevent single origin conflict
app.use(cors())
app.use(express.json())
app.use(morgan('tiny')) // using morgan


let contacts = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(contacts)
})


app.get('/info', (request, response) => {
    response.send(`<p> Phonebook has info for ${contacts.length} people </p> 
        ${Date()}`)
})

// find one person 
app.get('/api/persons/:id', (request, response) =>{
    const id = request.params.id
    const contact = contacts.find((n) => n.id === id)
    if (contact) {
        response.json(contact)
    } else {
        response.status(404).end()
    }
})

// delete a contact
app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    const contact = contacts.find(cont => cont.id === id); // Find the contact

    if (!contact) {
        return response.status(404).send({ "error": "contact does not exist" });
    }

    contacts = contacts.filter(cont => cont.id !== id); // Filter out the contact
    response.status(204).end();  // 204 No Content, meaning successful deletion
      
})

// adding new contact to backend
app.post('/api/persons', (request, response) => {
    const newContact = request.body
    const max = 99999999
   
    if(!newContact.name || !newContact.number){
      response.status(400).send({ error: "missing name or number to add" });
    } else if(contacts.find(cont => cont.name === newContact.name)){
        response.send({"error": "name must be unique"})
    } else {
        const id = Math.floor(Math.random() * max)
        newContactCopy = {...newContact, id: id}
        contacts = contacts.concat(newContactCopy)
        response.status(201).json(newContactCopy)
    }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
