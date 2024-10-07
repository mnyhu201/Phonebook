const Filter = (props) => {
    const {onChange, value} = props;
    return (<input value={value} onChange={onChange}></input>)
}



export default Filter;