import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './Assets/Styles/App.css'

import Login from './Components/Login/Login';

import AdminAttendance from './Components/Admin/AdminAttendance';
import AdminDashboard from './Components/Admin/Dashboard';
import EditForm from './Components/Admin/EditForm';
import AddUser from './Components/Admin/AddUser';
import AddDetails from './Components/Admin/AddDetails';

import StudentDashboard from './Components/Student/Dashboard';
import Attendance from './Components/Student/Attendance';
import ShowDetails from './Components/Student/ShowDetails';

const App = () => {
    return (
        <Router>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/Dashboard/:userid" element={<AdminDashboard />} />
                <Route path="/AdminAttendance/:userid" element={<AdminAttendance />} />
                <Route path="/edit/:userid/:subid" element={<EditForm />} />
                <Route path="/AddUser/:userid" element={<AddUser />} />
                <Route path="/AddDetails/:userid" element={<AddDetails />} />

                <Route path="/student/Dashboard/:uid" element={<StudentDashboard />} />
                <Route path="/student/Attendance/:uid" element={<Attendance />} />
                <Route path="/student/ShowDetails/:uid" element={<ShowDetails />} />

            </Routes>
        </Router>
    );
};

export default App;