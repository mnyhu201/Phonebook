const express = require('express')
const app = express()
const morgan = require('morgan');  // Import morgan
const cors = require('cors') // use cors to prevent single origin conflict
app.use(cors())
app.use(express.json())
app.use(morgan('tiny')) // using morgan
const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URI;
console.log(url)

mongoose.set('strictQuery',false)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })



const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)


app.get('/', (request, response) => {
  response.send('Phonebook info: <br/>', '/info: displays general info', 
    '/api/persons: all the contacts (/{id}: gets specific contact based on id) ' )
})

app.get('/api/persons', (request, response) => {
  Contact.find({})
    .then(contacts => {
      response.json(contacts);
    })
    .catch(error => {
      console.error('Error fetching contacts:', error);
      response.status(500).send({ error: 'Failed to fetch contacts' });
    });
});


app.get('/info', (request, response) => {
  Contact.countDocuments({})
    .then(count => {
      response.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`);
    })
    .catch(error => {
      console.error('Error fetching contact count:', error);
      response.status(500).send({ error: 'Failed to fetch contact count' });
    });
});

// find one person 
app.get('/api/persons/:id', (request, response) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).send({ error: 'Contact not found' });
      }
    })
    .catch(error => {
      console.error('Error fetching contact:', error);
      response.status(400).send({ error: 'Malformatted ID' });
    });
});

// delete a contact
app.delete('/api/persons/:id', (request, response) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).send({ error: 'Contact not found' });
      }
    })
    .catch(error => {
      console.error('Error deleting contact:', error);
      response.status(400).send({ error: 'Malformatted ID' });
    });
});

// adding new contact to backend
app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: 'Name and number are required' });
  }

  Contact.findOne({ name })
    .then(existingContact => {
      if (existingContact) { // existing product not null
        return response.status(400).json({ error: 'Name must be unique' });
      }
      // now adding new contact, make new object with schema
      const contact = new Contact({ name, number });
      contact.save()
        .then(savedContact => response.status(201).json(savedContact))
        .catch(error => {
          console.error('Error saving contact:', error);
          response.status(500).json({ error: 'Failed to save contact' });
        });
    });
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
