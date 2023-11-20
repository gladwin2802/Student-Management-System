import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import axios from 'axios';
import '../../Assets/Styles/EditForm.css'

function EditForm() {
    const params = useParams();
    const uid = params.userid;
    const subid = params.subid;
    const [studentDetails, setStudentDetails] = useState({});
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch student details and attendance records for editing
        axios.get(`http://localhost:8000/getStudentAttendance/${uid}/${subid}`)
            .then(response => {
                const { student, attendance } = response.data;
                setStudentDetails(student);
                setAttendanceRecords(attendance);
            })
            .catch(error => {
                // console.error('Error fetching student attendance details:', error);
            });
        // eslint-disable-next-line
    }, [uid]);

    const handleStatusChange = (date, status) => {
        // Update the local state when a user changes the attendance status
        const updatedAttendance = attendanceRecords.map(record => {
            if (record.date === date) {
                return { ...record, status };
            }
            return record;
        });
        setAttendanceRecords(updatedAttendance);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:8000/editAttendance/${uid}/${subid}`, { attendance: attendanceRecords })
            .then(response => {
                // console.log(response.data);
                window.alert('Updated sucessfully');
                navigate(`/AdminAttendance/${uid}`);
            })
            .catch(error => {
                // console.error('Error updating attendance records:', error);
            });
    };

    return (
        <div>
            <Header></Header>
            <center>
                <h2>Edit Attendance</h2>
                <div className='edit'>
                    <p>Student Name </p>
                    <input type="text" name="name" id="name" value={studentDetails.firstName + " " + studentDetails.lastName} readOnly />
                    <p>Roll No </p>
                    <input type="text" name="rollno" id="rollno" value={studentDetails.rollno} readOnly />
                    <form onSubmit={handleSubmit}>
                        {attendanceRecords.map(record => (
                            <div key={record.index}>
                                <p>Date: {record.date}</p>
                                <div className="status">
                                    <label>
                                        <span>Present</span>
                                        <input
                                            type="radio"
                                            name={record.date}
                                            value="Present"
                                            checked={record.status === 'Present'}
                                            onChange={() => handleStatusChange(record.date, 'Present')}
                                        />
                                    </label>
                                    <label>
                                        <span>Absent</span>
                                        <input
                                            type="radio"
                                            name={record.date}
                                            value="Absent"
                                            checked={record.status === 'Absent'}
                                            onChange={() => handleStatusChange(record.date, 'Absent')}
                                        />
                                    </label>
                                </div>
                            </div>
                        ))}
                        <center>
                            <button type="submit">Update</button>
                        </center>
                    </form>
                </div>
            </center>
        </div>
    );
}

export default EditForm;
