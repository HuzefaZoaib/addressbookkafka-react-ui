import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddressAdd() {

    const [inputs, setInputs] = useState({});

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setInputs( values => ({...values, [name]:value}) );
    }

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.put(`${process.env.REACT_APP_API_URI}/`, inputs).then(
            response => { navigate("/list") }
        ).catch(error => {console.error(error);})

        console.log(inputs);
    }

    return (<>
        <form onSubmit={handleSubmit} class="add-form-div"> 
            <label for="name">Name</label>
            <input name="name" type="text" required value={inputs.name || ""} onChange={handleChange} />
            <br/>
            <label for="phone">Phone</label>
            <input name="phone" type="text" required value={inputs.phone || ""} onChange={handleChange} />
            <br/>
            <label for="address">Address</label>
            <input name="address" type="text" required value={inputs.address || ""} onChange={handleChange} />
            <br/>
            <button type="submit" class="primary">Submit</button>
        </form>
    </>);
}
