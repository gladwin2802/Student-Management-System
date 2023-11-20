import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../Assets/Styles/AdminAttendance.css';
import Header from './Header';
import axios from 'axios';
import noDataImage from '../../Assets/Images/no-data.png';

function AdminAttendance() {
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the list of subjects from the backend when the component mounts
        axios.get('http://localhost:8000/getSubjects')
            .then(response => {
                setSubjects(response.data);
            })
            .catch(error => {
                // console.error('Error fetching subjects:', error);
            });
    }, []);

    const handleSubjectChange = (e) => {
        setSelectedSubject(e.target.value);
        // Fetch and update attendance records when the subject changes
        axios.get(`http://localhost:8000/getAttendance/${e.target.value}`)
            .then(response => {
                setAttendanceRecords(response.data);
            })
            .catch(error => {
                // console.error('Error fetching attendance records:', error);
            });
    };

    if (!selectedSubject || attendanceRecords.length === 0) {
        return (
            <div className='adminAtnd'>
                <Header></Header>
                <h1>Admin Attendance</h1>
                <label>
                    <select value={selectedSubject} onChange={handleSubjectChange}>
                        <option value="" disabled>Select a subject</option>
                        {subjects.map(subject => (
                            <option key={subject.cid} value={subject.cid}>{subject.classname}</option>
                        ))}
                    </select>
                </label>
                <img src={noDataImage} alt="No Data" />
            </div>
        );
    }

    return (
        <div className='adminAtnd'>
            <Header></Header>
            <h1>Student Attendance</h1>
            <label>
                <select value={selectedSubject} onChange={handleSubjectChange}>
                    <option value="" disabled>Select a subject</option>
                    {subjects.map(subject => (
                        <option key={subject.cid} value={subject.cid}>{subject.classname}</option>
                    ))}
                </select>
            </label>

            <table>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>RollNo</th>
                        {attendanceRecords.length > 0 && attendanceRecords[0].dates.map(date => (
                            <th key={date}>{date}</th>
                        ))}
                        <th>No. of Present</th>
                        <th>No. of Absent</th>
                        <th>Total Percentage</th>
                        <th>Option</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceRecords.map(studentRecord => (
                        <tr key={studentRecord.uid}>
                            <td style={{ textAlign: 'left' }}>{studentRecord.name}</td>
                            <td>{studentRecord.rollno}</td>
                            {studentRecord.status.map((status, index) => (
                                <td key={index}>{status}</td>
                            ))}
                            <td>{studentRecord.present}</td>
                            <td>{studentRecord.absent}</td>
                            <td>{studentRecord.percentage}%</td>
                            <td>
                                <center>
                                    <button onClick={() => navigate(`/edit/${studentRecord.uid}/${selectedSubject}`)}>
                                        Edit
                                    </button>
                                </center>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminAttendance;