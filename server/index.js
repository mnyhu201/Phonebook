const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config(); // To load environment variables from .env

// Import the Contact model
const Contact = require('./models/Contact');

const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON bodies
app.use(morgan('tiny')); // For logging HTTP requests

// MongoDB Connection
const url = process.env.MONGODB_URI;
mongoose.set('strictQuery', false);
mongoose.connect(url);

// Routes

// GET /api/persons - Get all contacts
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

// GET /api/persons/:id - Get a single contact by ID
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

// DELETE /api/persons/:id - Delete a contact by ID
app.delete('/api/persons/:id', (req, res) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(result => result ? res.status(204).end() : res.status(404).send({ error: 'Contact not found' }))
    .catch(error => res.status(400).send({ error: 'Malformatted ID' }));
});

// POST /api/persons - Add a new contact
app.post('/api/persons', (request, response) => {
  const { name, number } = request.body;

  if (!name || !number) {
    return response.status(400).json({ error: 'Name and number are required' });
  }

  Contact.findOne({ name })
    .then(existingContact => {
      if (existingContact) {
        return response.status(400).json({ error: 'Name must be unique' });
      }

      const contact = new Contact({ name, number });
      contact.save()
        .then(savedContact => response.status(201).json(savedContact))
        .catch(error => {
          console.error('Error saving contact:', error);
          response.status(500).json({ error: 'Failed to save contact' });
        });
    });
});

// GET /info - Display number of contacts and current time
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

// Server listen
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
