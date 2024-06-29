import axios from "axios";
import { useForm } from 'react-hook-form';
import { useNavigate } from "react-router-dom";
import { updateAddressess } from "./Addresses";

export default function AddressAdd() {

    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm();

    const navigate = useNavigate();
    const _handleSubmit = (data) => {
        //event.preventDefault();
        axios.put(`${process.env.REACT_APP_API_URI}/`, data).then(
            response => { navigate("/list") }
        ).catch(error => {
            console.error(error);
            updateAddressess(data);
            navigate("/list")
        })

        console.log(data);
    }

    return (<>
        <form onSubmit={handleSubmit((data) => _handleSubmit(data))} class="add-form-div">
            <label for="name">Name</label>
            <input {...register('name', {required: true, minLength:3, maxLength:25, pattern:/^[A-Za-z]+$/i})} />
            {errors.name && <span class="errorMsg">Name should be alphabet between 3 - 25 letters</span>}
            <br/>
            <label for="name">Phone</label>
            <input {...register('phone', {required: true, minLength:3, maxLength:12, pattern:/\d+/})} />
            {errors.phone && <span class="errorMsg">Phone should be numbers between 3 - 12 letters</span>}
            <br/>
            <label for="name">Address</label>
            <input {...register('address', {required: true, minLength:3, maxLength:25})} />
            {errors.address && <span class="errorMsg">Address should be alphabet between 3 - 25 letters</span>}
            <br/>
            <button type="submit">Submit</button>
        </form>
    </>);
}
