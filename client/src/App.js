import './App.css';
import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services.js'
import Persons from './Persons'
import Filter from './Filter'
import PersonForm from './PersonForm'
import Message from './Message.js'


const App = () => {
  // states
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('');
  const [newFilter, setNewFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

   // fetch from database
   const fetch = () => {
    personService
      .getAll()
      .then(response => {
        setPersons(response);
        console.log("Initial data retrieved")
      })
  }
  useEffect(fetch, [])


  // onChange functions
  const onChangeNewName = (event) => {
    setNewName(event.target.value);
  };

  const onChangeNewNumber = (event) => {
    setNewNumber(event.target.value);
  };

  const onDelete = (id) => {
    return () => {
      const name = persons.find(p => p.id === id).name 
      if(!window.confirm("Are you sure you want to delete \"" + name + "\" from your contacts?" ))
        return;
      
      personService.removePerson(id).then(
        () => {
          console.log(name + " deleted successfully")
          setPersons(persons.filter(p => p.id !== id))
          setErrorMessage("Contact deleted successfully")
          setTimeout(() => {
            setErrorMessage(null);
          }, 2000);
        }
      ).catch(error => console.log(error + "\nError: Could not remove contact"));
    }

  }

  const onAddContact = (event) => {
    event.preventDefault();
    if(persons.some(p => p.name === newName)){
      if(!window.confirm(`${newName} is already added to phonebook, replace old number with a new one?`)){
        return;
      }
      // update user's phone number
      const currPerson = persons.find(p => p.name === newName);
      const newPerson = {...currPerson, "number" : newNumber};
      console.log(currPerson, newPerson)
      personService
        .editPerson(currPerson.id, newPerson)
        .then(response => {
          console.log(`Successfully upated ${newPerson.name}'s number`);
          setPersons(persons.map(p => p.id === currPerson.id ? newPerson : p));
          setErrorMessage("Contact updated successfully");
          setTimeout(() => {
            setErrorMessage(null);
          }, 2000);
        })
        .catch(error => {
          setErrorMessage("Contact information of " + newPerson.name + "was already removed");
          setTimeout(() => {
            setErrorMessage(null);
          }, 2000)
        });

    } else {
      // adding new contact to database and persons state
      const newContact = ({"name" : newName, "number" : newNumber});
      personService
        .addPerson(newContact)
        .then(response => {
          setPersons(persons.concat(response))
          setErrorMessage("Contact added successfully")
          setTimeout(() => {
            setErrorMessage(null);
          }, 2000)
        })
        .catch(error => console.log(error + "\nError could not add new contact"));
    }
    
    // updating input boxes state
    setNewNumber("");
    setNewName("");
  }

  const onFilterChange = (event) => {
    setNewFilter(event.target.value);
  }

  //building final app component
  return (
    <div>
      <h1>Phonebook</h1>
      <Message value={errorMessage}/>
      Search <Filter value={newFilter} onChange={onFilterChange}/>
      <br/>
      <br/>
      
      <h2>Add a new contact</h2>

      <PersonForm 
        newName={newName}
        onChangeNewName={onChangeNewName}
        newNumber={newNumber}
        onChangeNewNumber={onChangeNewNumber}
        onSubmit={onAddContact}
      />
      
      <h2>Numbers</h2>
      <Persons setPersons={setPersons} persons={persons} filter={newFilter} onDelete={onDelete}/>
    </div>
  )
}

export default App