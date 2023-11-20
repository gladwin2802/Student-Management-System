import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import '../../Assets/Styles/AddUser.css';
import Header from './Header';


function AddUser() {
    const navigate = useNavigate();
    const params = useParams();
    const uid = params.uid;

    const [formData, setFormData] = useState({
        emailid: '',
        password: '',
        confirmPassword: '',
        role: 0,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            window.alert("Passwords do not match !!!")
            console.error('Passwords do not match');
            return;
        }

        console.log(formData);

        axios.post('http://localhost:8000/registerUser', formData)
            .then(response => {
                window.alert("User registered successfully !!!");
                // console.log('User registered successfully:', response.data);
                navigate(`/Dashboard/${uid}`);
            })
            .catch(error => {
                window.alert(error.response.data.error);
                // console.error('Error registering user:', error);
            });
    };

    return (
        <div>
            <Header></Header>
            <div className='register'>
                <h2>User Registration</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="emailid"
                            value={formData.emailid}
                            onChange={handleChange}
                            placeholder='Enter the email...'
                            required
                        />
                    </label>
                    <br />

                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            placeholder='Enter the password...'
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />

                    <label>
                        Confirm Password:
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            placeholder='Re-enter password again...'
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <br />

                    <label>
                        Role:
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value={0}>Student</option>
                            <option value={1}>Admin</option>
                        </select>
                    </label>
                    <br />
                    <br />
                    <center>
                        <button type="submit">Register</button>
                    </center>
                </form>
            </div>
        </div>
    );
}

export default AddUser;
