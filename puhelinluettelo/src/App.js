import { useEffect, useState } from 'react'
import personsService from './services/persons'

const Persons = (props) => {
  return (
    props.persons.map(person =>
        <p key={person.name}>{person.name} {person.number}
        <button onClick={() => props.handleDelete(person.id)}>delete</button></p>
    )
  )
}

const AddPersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange} />
    </div>
    <div>
      number: <input value={props.newNumber} onChange={props.handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with: <input onChange={props.handleSearch} id='searchTxt'/>
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  if (message.includes('Information')) {
    console.log('tuli errori')
    return(
      <div className='error' >
        {message}
      </div>
    ) 
  }

    return (
    <div className='success' >
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [personsFiltered, setPersonsFiltered] = useState()
  const [successMessage, setSuccessMessage] = useState(null)

  const personsToShow = showAll
    ? persons
    : personsFiltered

  
  const hook = () => {
    console.log('effect')
    personsService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }
  useEffect(hook, [newName])
  console.log('render', persons.length, 'persons')

  const addPerson = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName,
      number: newNumber
    }
    if ((persons.map(person => person.name).includes(nameObject.name))) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        console.log('korvattava', persons[persons.findIndex(person => person.name === newName)].id)
        personsService
          .update(persons[persons.findIndex(person => person.name === newName)].id, nameObject)
          .then(
            console.log('muutettu'),
            setSuccessMessage(`Number changed ${nameObject.name}`),
            setTimeout(() => {
              setSuccessMessage(null)
            }, 3000)
            )
          .catch(error => {
            setSuccessMessage(`Information of ${nameObject.name} has already been removed from the server`) 
          },
          setTimeout(() => {
            setSuccessMessage(null)
          }, 3000)
          )
      }
  }
    else(
    personsService
      .create(nameObject)
      .then(
        setPersons(persons.concat(nameObject)),
        console.log(nameObject.name),
        setSuccessMessage(`Added ${nameObject.name}`),
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      ))
      setNewName('')
      setNewNumber('')
    
  }
  
  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }


  const handleSearch = () => {
    if (document.getElementById("searchTxt").value !== '') {
      setShowAll(false)
      console.log(document.getElementById("searchTxt").value)
      setPersonsFiltered(persons.filter(person => person.name.includes(document.getElementById("searchTxt").value)))
    }
    else {
      setShowAll(true)
      console.log('hakukenttä on tyhjä')
    }
  }

  const handleDelete = personId => {
    console.log('delete', personId)
    if (window.confirm(`Delete ${persons.find(person => person.id === personId).name}`)) {
    personsService
      .deleteName(personId)
      .then(setPersons(
        persons.filter(person => person.id !== personId),
        setSuccessMessage(`Deleted ${persons.find(person => person.id === personId).name}`),
        setTimeout(() => {
          setSuccessMessage(null)
        }, 3000)
      ))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={successMessage} />

      <Filter handleSearch={handleSearch} />

      <h2>Add a new</h2>

      <AddPersonForm addPerson={addPerson} newName={newName} newNumber={newNumber}
      handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>

      <Persons persons={personsToShow} handleDelete={handleDelete} />

    </div>
  )

}

export default App