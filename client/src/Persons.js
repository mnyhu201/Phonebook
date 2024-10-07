import removePerson from './services.js'
import personService from './services.js'

const Persons = (props) => {
    const {persons, filter, setPersons, onDelete} = props;
    const filteredPersons = persons.filter(p => p.name.includes(filter))

    if(persons == null || persons == []){
        return <></>
    }

    return (
        <div>
            {filteredPersons.map(p => {
                return <div key={p.name}>
                    {p.name} {p.number} 
                    <button onClick={onDelete(p.id)} 
                    className='delete-button'>X</button> 
                </div>
            })}
        </div>)
}
  



export default Persons;
