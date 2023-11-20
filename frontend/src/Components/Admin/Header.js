import React from 'react'
import '../../Assets/Styles/Header.css'
import { useNavigate, useParams } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const params = useParams();
    const uid = params.userid;

    const goToLogin = () => {
        navigate('/');
    };

    const goToAdminDashboard = () => {
        navigate(`/Dashboard/${uid}`);
    };

    return ( 
        <div className='headerBar'>
            <div className='title'>Student Management System</div>
            <div className='nav'>
                <span onClick={goToAdminDashboard}>Dashboard</span>
                <span onClick={goToLogin}>Logout</span>
            </div>
        </div>
    )
}

export default Header