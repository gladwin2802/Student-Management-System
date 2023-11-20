import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../Assets/Styles/ShowDetails.css';
import Header from './Header';

import axios from 'axios';

function ShowDetails() {
    const params = useParams();
    const uid = params.uid;
    // eslint-disable-next-line
    const [userDetails, setUserDetails] = useState({});
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', rollno: '',
        email: '', dob: '', gender: '',
        nationality: '', address: '', phoneNo: '',
    });

    useEffect(() => {
        axios.get(`http://localhost:8000/getDetails/${uid}`)
            .then(response => {
                setUserDetails(response.data);
                setFormData({
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    rollno: response.data.rollno,
                    email: response.data.email,
                    dob: response.data.dob,
                    gender: response.data.gender,
                    nationality: response.data.nationality,
                    address: response.data.address,
                    phoneNo: response.data.phoneNo,
                });
            })
            .catch(error => {
                // console.error('Error fetching user details:', error);
            });
    }, [uid]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div>
            <Header></Header>
            <div className='details'>
                <h1>Details</h1>
                <form>
                    <div className='col'>
                        <label>
                            <span>First Name:</span>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                readOnly
                            />
                        </label>
                        <br />

                        <label>
                            <span>Last Name:</span>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                readOnly
                            />
                        </label>
                        <br />

                        <label>
                            <span>Roll No:</span>
                            <input
                                type="text"
                                name="rollno"
                                value={formData.rollno}
                                onChange={handleChange}
                                readOnly
                            />
                        </label>
                        <br />

                        <label>
                            <span>Email:</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                readOnly
                            />
                        </label>
                        <br />

                        <label style={{ marginBottom: '0px' }}>
                            <span>Date of Birth:</span>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                style={{ marginBottom: '0px' }}
                                readOnly
                            />
                        </label>
                        <br />
                    </div>
                    <div className='col'>
                        <label>
                            <span>Gender:</span>
                            <input
                                type="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                readOnly
                            />

                        </label>
                        <br />

                        <label>
                            <span>Nationality:</span>
                            <input
                                type="text"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                readOnly
                            />
                        </label>
                        <br />

                        <label>
                            <span>Address:</span>
                            <textarea
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                readOnly
                            ></textarea>
                        </label>
                        <br />

                        <label>
                            <span>Phone No:</span>
                            <input
                                type="text"
                                name="phoneNo"
                                value={formData.phoneNo}
                                onChange={handleChange}
                                readOnly
                            />
                        </label>
                        <br />
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ShowDetails;
