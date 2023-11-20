import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios'
import Header from './Header';
import '../../Assets/Styles/AddDetails.css';

const AddDetails = () => {
    const navigate = useNavigate();
    const params = useParams();
    const uid = params.uid;

    const [formData, setFormData] = useState({
        firstName: '', lastName: '', rollno: '',
        email: '', dob: '', gender: '',
        nationality: '', address: '', phoneNo: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        axios.post('http://localhost:8000/addDetails', formData)
            .then(response => {
                window.alert("Student details added successfully !!!");
                navigate(`/Dashboard/${uid}`);
                // console.log(response.data);
            })
            .catch(error => {
                window.alert(error.response.data.error);
                // console.error('Error submitting data:', error);
            });
    };

    return (
        <div>
            <Header></Header>
            <div className='add-details'>
                <h2>Add Student Details</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />

                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />

                    <label>
                        Roll No:
                        <input
                            type="text"
                            name="rollno"
                            value={formData.rollno}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />

                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />

                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />

                    <label>
                        Gender:
                        <select name="gender" value={formData.gender} onChange={handleChange} required>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </label>
                    <br />

                    <label>
                        Nationality:
                        <input
                            type="text"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />

                    <label>
                        Address:
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </label>
                    <br />

                    <label>
                        Phone No:
                        <input
                            type="text"
                            name="phoneNo"
                            value={formData.phoneNo}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />
                    <center>
                        <button type="submit">Submit</button>
                    </center>
                </form>
            </div>
        </div>
    );
};

export default AddDetails;
