import React from 'react';
import '../../Assets/Styles/AdminDashboard.css';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import attendance from '../../Assets/Images/attendance.jpg';
import student from '../../Assets/Images/student.png';
import addUser from '../../Assets/Images/addUser.jpg';

const Dashboard = () => {
    const params = useParams();
    const userid = params.userid;
    const navigate = useNavigate();

    const goToAdminAttendance = () => {
        navigate(`/AdminAttendance/${userid}`);
    };

    const goToAddUser = () => {
        navigate(`/AddUser/${userid}`);
    }

    const goToAddDetails = () => {
        navigate(`/AddDetails/${userid}`);
    };

    return (
        <div>
            <Header></Header>
            <h1>Welcome to the Admin Dashboard!</h1>
            <br/>
            <div className='options'>
                <div onClick={goToAdminAttendance} className='card'>
                    <img src={attendance} alt="attendance" className='atnd'/>
                    <span>Attendance</span>
                </div>
                <div onClick={goToAddUser} className='card'>
                    <img src={addUser} alt="attendance" className='atnd'/>
                    <span>Add User</span>
                </div>
                <div onClick={goToAddDetails} className='card'>
                    <img src={student} alt="add student" className='stnd'/>
                    <span>Add Details</span>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;