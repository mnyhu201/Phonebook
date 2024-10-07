const Message = (props) => {
    const {value} = props;
    if(value != null){
        return <p className="errorMessage">{value}</p>
    }
    return <></>
}

export default Message;