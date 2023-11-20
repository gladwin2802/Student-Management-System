import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Assets/Styles/Login.css';
import axios from 'axios';

import e_icon from '../../Assets/Images/email.png';
import p_icon from '../../Assets/Images/pwd.png';

const Login = () => {
    const navigate = useNavigate();
    const [values, setValues] = useState({
        email: '',
        password: '',
        role: 'admin',
    });

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (values.email !== '' && values.password !== '') {
            axios.post(`http://localhost:8000/login/${values.role}`, values)
                .then(res => {
                    // console.log('Login successful:', res.data.user);
                    window.alert("Login Successful !!!");
                    if (values.role === 'admin') {
                        navigate(`/Dashboard/${res.data.user.uid}`);
                    } else {
                        navigate(`/student/Dashboard/${res.data.user.uid}`);
                    }
                })
                .catch(err => {
                    window.alert("Invalid Username/Password/Role");
                    // console.error('Login failed:', err);
                    navigate(`/`);
                })
        } else {
            window.alert("Give Username, Password and Role");
            // console.log("Empty fields !!!");
            navigate(`/`);
        }
    };

    return (
        <div className='background'>
            <div className='headerBar'>
                <div className='title'>Student Management System</div>
            </div>
            <div className='login'>
                <form onSubmit={handleSubmit}>
                    <div className="container">
                        <div className="header">
                            <div className="text">Login</div>
                            <div className="underline"></div>
                        </div>
                        <div className="inputs">
                            <div className="input">
                                <img src={e_icon} alt="email" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Id..."
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="inputs">
                            <div className="input">
                                <img src={p_icon} alt="pswd" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password..."
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="role-container">
                            <label>
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={values.role === 'admin'}
                                    onChange={handleChange}
                                />
                                Admin
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={values.role === 'student'}
                                    onChange={handleChange}
                                />
                                Student
                            </label>
                        </div>
                        <div className="submit-container">
                            <button type="submit" className="submit">
                                Login
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;