import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../../Assets/Styles/Attendance.css'
import Header from './Header';

import axios from 'axios';

function Attendance() {
    const params = useParams();
    const uid = params.uid;
    const [attendanceData, setAttendanceData] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/getStudentAttendance/${uid}`)
            .then(response => {
                const dataFromServer = response.data.attendance;
                if (typeof dataFromServer === 'object' && !Array.isArray(dataFromServer)) {
                    const dataArray = Object.entries(dataFromServer).map(([classname, data]) => ({ classname, ...data, }));
                    setAttendanceData(dataArray);
                } else {
                    // console.error('Invalid data format received from server:', dataFromServer);
                }
            })
            .catch(error => {
                // console.error('Error fetching attendance data:', error);
            });
    }, [uid]);

    return (
        <div>
            <Header></Header>
            <div className='studentAtnd'>
                <h1>Attendance</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Subjects</th>
                            {attendanceData.length > 0 && attendanceData[0].statusDataArray.map(item => (
                                <th key={item.date}>{item.date}</th>
                            ))}
                            <th>No. of Present</th>
                            <th>No. of Absent</th>
                            <th>Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map(subject => (
                            <tr key={subject.classname}>
                                <td>{subject.classname}</td>
                                {subject.statusDataArray.map(item => (
                                    <td key={item.date}>{item.status}</td>
                                ))}
                                <td>{subject.presentCount}</td>
                                <td>{subject.absentCount}</td>
                                <td>{subject.percentage}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Attendance;