const PersonForm = (props) => {
    const {onSubmit, newName, onChangeNewName, newNumber, onChangeNewNumber} = props

    return <form onSubmit={onSubmit}>
        <div>
        name: <input value={newName} onChange={onChangeNewName}/>
        <br/>
        number: <input value={newNumber} onChange={onChangeNewNumber}/>
        </div>
        <div>
        <button type="submit">add</button>
        </div>
    </form> 
}

export default PersonForm;