import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import attendance from '../../Assets/Images/attendance.jpg';
import student from '../../Assets/Images/details.jpg';
import '../../Assets/Styles/StudentDashboard.css'

const Dashboard = () => {
    const navigate = useNavigate();
    const params = useParams();
    const uid = params.uid;

    const goToAttendance = () => {
        navigate(`/student/Attendance/${uid}`);
    };

    const goToShowDetails = () => {
        navigate(`/student/ShowDetails/${uid}`);
    };

    return (
        <div>
            <Header></Header>

            <h1>Welcome to the Student Dashboard!</h1>
            <br/>
            <div className='options'>
                <div onClick={goToAttendance} className='card'>
                    <img src={attendance} alt="attendance" className='atnd'/>
                    <span>Attendance</span>
                </div>
                <div onClick={goToShowDetails} className='card'>
                    <img src={student} alt="add student" className='stnd'/>
                    <span>Show Details</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
