import axios from 'axios'

const baseUrl = 'http://localhost:3001/api/persons';

const getAll = () => {
    const request = axios.get(baseUrl);
    return request.then(response => response.data);
}
    

const addPerson = (newPerson) => {
    const request = axios.post(baseUrl, newPerson)
    return request.then(response => response.data)
}

const removePerson = (id) => {
    const del = axios.delete(`${baseUrl}/${id}`);
    return del.then(response => response.data)
}

const editPerson = (id, person) => {
    const update = axios.put(`${baseUrl}/${id}`, person);
    return update.then(response => response.data);
}

export default { getAll, addPerson, removePerson, editPerson };