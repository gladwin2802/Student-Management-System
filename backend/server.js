const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "2802glad",
    database: "sms"
})

// Admin

// Admin Login

app.post('/login/admin', (req, res) => {
    const { email, password, role } = req.body;
    const sql = 'SELECT * FROM users WHERE emailid = ? AND password = ? AND role = 1';
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = results[0];
        return res.json({ message: 'Login successful', user });
    });
});

// Add User
app.post('/registerUser', (req, res) => {
    const { emailid, password, role } = req.body;
    db.query(
        'SELECT * FROM users WHERE emailid = ?',
        [emailid],
        (err, result) => {
            if (err) {
                // console.error('Error checking email existence:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            if (result.length > 0) {
                return res.status(409).json({ error: 'Email already exists !!!' });
            }
            db.query(
                'INSERT INTO users (emailid, password, role) VALUES (?, ?, ?)',
                [emailid, password, role],
                (err, result) => {
                    if (err) {
                        // console.error('Error registering student:', err);
                        return res.status(500).json({ error: 'Internal Server Error !!!' });
                    }
                    const uid = result.insertId;
                    return res.status(200).json({ uid, message: 'User registered successfully !!!' });
                }
            );
        }
    );
});

// Add Student Details
app.post('/addDetails', (req, res) => {
    try {
        const { firstName, lastName, rollno, email, dob, gender, nationality, address, phoneNo } = req.body;
        // Step 1: Check if the email exists in the users table with role 0
        const checkUserQuery = `SELECT uid FROM users WHERE emailid = ? AND role = 0`;
        db.query(checkUserQuery, [email], (err, userResults) => {
            if (err) {
                // console.error('Error checking user:', err);
                return res.status(500).json({ error: 'Internal Server Error !!!' });
            }
            if (userResults.length === 0) {
                // The user with the given email and role 0 does not exist, so return an error
                return res.status(403).json({ error: 'Unauthorized: User not found or not authorized.' });
            }
            const studentUid = userResults[0].uid;
            // Step 2: Insert student details into the student_details table
            const insertStudentQuery = `
                INSERT INTO student_details (uid, firstName, lastName, rollno, email, dob, gender, nationality, address, phoneNo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            db.query(insertStudentQuery, [studentUid, firstName, lastName, rollno, email, dob, gender, nationality, address, phoneNo], (err, studentInsertResult) => {
                if (err) {
                    // console.error('Error inserting student details:', err);
                    return res.status(500).json({ error: 'Internal Server Error !!!' });
                }
                // Step 3: Retrieve all existing subjects (classes) from the class table
                const getSubjectsQuery = `SELECT cid, classname FROM class`;
                db.query(getSubjectsQuery, (err, subjects) => {
                    if (err) {
                        // console.error('Error fetching subjects:', err);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    // Step 4: Retrieve all existing dates from the attendance table
                    const getDatesQuery = `SELECT DISTINCT date FROM attendance`;
                    db.query(getDatesQuery, (err, dates) => {
                        if (err) {
                            // console.error('Error fetching dates:', err);
                            return res.status(500).json({ error: 'Internal Server Error' });
                        }
                        // Step 5: Create attendance records for the student for each subject on each date
                        const insertAttendanceQuery = `
                            INSERT INTO attendance (uid, rollno, cid, date, status)
                            VALUES (?, ?, ?, ?, ?)`;

                        const attendanceRecords = [];

                        dates.forEach((date) => {
                            subjects.forEach((subject) => {
                                attendanceRecords.push([studentUid, rollno, subject.cid, date.date, 'NULL']);
                            });
                        });

                        // Step 6: Insert attendance records into the attendance table
                        attendanceRecords.forEach((record) => {
                            db.query(insertAttendanceQuery, record, (err, insertAttendanceResult) => {
                                if (err) {
                                    // console.error('Error inserting attendance record:', err);
                                    return res.status(500).json({ error: 'Internal Server Error' });
                                }
                            });
                        });
                        res.status(200).json({ message: 'Student details added and attendance records created.' });
                    });
                });
            });
        });
    } catch (error) {
        // console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Edit Form

app.get('/getStudentAttendance/:uid/:subid', (req, res) => {
    try {
        const { uid, subid } = req.params;

        // Step 1: Check if the user exists
        const checkUserQuery = 'SELECT uid FROM users WHERE uid = ? AND role = 0';
        db.query(checkUserQuery, [uid], (errCheckUser, userResult) => {
            if (errCheckUser) {
                // console.error('Error checking user:', errCheckUser);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (userResult.length === 0) {
                return res.status(403).json({ error: 'Unauthorized: User not found or not authorized.' });
            }

            // Step 2: Fetch student details
            const getStudentDetailsQuery = 'SELECT firstName, lastName, rollno FROM student_details WHERE uid = ?';
            db.query(getStudentDetailsQuery, [uid], (errStudentDetails, studentDetailsResult) => {
                if (errStudentDetails) {
                    // console.error('Error fetching student details:', errStudentDetails);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                if (studentDetailsResult.length === 0) {
                    return res.status(404).json({ error: 'Student details not found.' });
                }

                const studentDetails = {
                    firstName: studentDetailsResult[0].firstName,
                    lastName: studentDetailsResult[0].lastName,
                    rollno: studentDetailsResult[0].rollno,
                };

                // Step 3: Fetch attendance records based on uid and subid
                const getAttendanceQuery = "SELECT DATE_FORMAT(date, '%Y-%m-%d') as fdate, status FROM attendance WHERE uid = ? AND cid = ?";
                db.query(getAttendanceQuery, [uid, subid], (errAttendance, attendanceResult) => {
                    if (errAttendance) {
                        // console.error('Error fetching attendance records:', errAttendance);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }

                    const attendanceRecords = attendanceResult.map(record => ({
                        date: record.fdate,
                        status: record.status,
                    }));

                    res.status(200).json({ student: studentDetails, attendance: attendanceRecords });
                });
            });
        });
    } catch (error) {
        // console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/editAttendance/:uid/:cid', (req, res) => {
    try {
        const { uid, cid } = req.params;
        const { attendance } = req.body;

        // Step 1: Check if the user exists
        const checkUserQuery = 'SELECT uid FROM users WHERE uid = ? AND role = 0';
        db.query(checkUserQuery, [uid], (errCheckUser, userResult) => {
            if (errCheckUser) {
                // console.error('Error checking user:', errCheckUser);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (userResult.length === 0) {
                return res.status(403).json({ error: 'Unauthorized: User not found or not authorized.' });
            }

            // Step 2: Update attendance records
            const updateAttendanceQuery = `
                UPDATE attendance
                SET status = ?
                WHERE uid = ? AND cid = ? AND DATE_FORMAT(date, '%Y-%m-%d') = ?`;

            // Update each attendance record using a loop
            attendance.forEach(record => {
                db.query(updateAttendanceQuery, [record.status, uid, cid, record.date], (errUpdate, updateResult) => {
                    if (errUpdate) {
                        // console.error('Error updating attendance records:', errUpdate);
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                });
            });

            res.status(200).json({ message: 'Attendance records updated successfully.' });
        });
    } catch (error) {
        // console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// AdminAttendance

app.get('/getSubjects', (req, res) => {
    const getSubjectsQuery = `
      SELECT cid, classname FROM class`;
    db.query(getSubjectsQuery, (err, results) => {
        if (err) {
            console.error('Error fetching subjects:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.json(results);
    });
});

app.get('/getAttendance/:subjectId', (req, res) => {
    const { subjectId } = req.params;
    // Fetch attendance records for the selected subject from the backend
    const getAttendanceQuery = `
        SELECT
            s.uid,
            s.firstName,
            s.lastName,
            s.rollno,
            DATE_FORMAT(a.date, '%Y-%m-%d') AS formattedDate,
            c.classname AS subjectName,
            a.status
        FROM student_details s
        LEFT JOIN attendance a ON s.uid = a.uid AND a.cid = ?
        LEFT JOIN class c ON a.cid = c.cid
        ORDER BY s.rollno;
    `;

    db.query(getAttendanceQuery, [subjectId], (err, results) => {
        if (err) {
            // console.error('Error fetching attendance records:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Transform the results into a format suitable for frontend rendering
        const transformedRecords = results.reduce((acc, record) => {
            if (!acc[record.uid]) {
                acc[record.uid] = {
                    uid: record.uid,
                    name: `${record.firstName} ${record.lastName}`,
                    rollno: record.rollno,
                    dates: [],
                    status: [],
                    present: 0,
                    absent: 0,
                    percentage: 0,
                };
            }

            if (record.formattedDate && !acc[record.uid].dates.includes(record.formattedDate)) {
                acc[record.uid].dates.push(record.formattedDate);
                acc[record.uid].status.push(record.status);
                if (record.status === 'Present') {
                    acc[record.uid].present += 1;
                } else if (record.status === 'Absent') {
                    acc[record.uid].absent += 1;
                }
            }

            return acc;
        }, {});

        // Calculate percentage for each student
        Object.values(transformedRecords).forEach(studentRecord => {
            const totalDates = studentRecord.dates.length;
            const totalPresent = studentRecord.present;
            studentRecord.percentage = ((totalPresent / totalDates) * 100).toFixed(2);
        });

        // console.log(Object.values(transformedRecords));
        res.json(Object.values(transformedRecords));
    });
});

// Student

// Student Login

app.post('/login/student', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE emailid = ? AND password = ? AND role = 0';
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = results[0];
        return res.json({ message: 'Login successful', user });
    });
});

// Student Attendance

app.get('/getStudentAttendance/:uid', (req, res) => {
    function formatAttendanceData(records) {
        // Initialize a data structure to organize attendance data
        const formattedData = {};
        // Iterate through the records and organize data by class and date
        records.forEach(record => {
            const { classname, date, status } = record;

            if (!formattedData[classname]) {
                formattedData[classname] = {
                    dates: [],
                    data: {},
                    statusData: {}, // Added statusData
                    presentCount: 0,
                    absentCount: 0,
                };
            }

            if (!formattedData[classname].data[date]) {
                formattedData[classname].dates.push(date);
                formattedData[classname].data[date] = status;
                formattedData[classname].statusData[date] = status; // Added statusData
                if (status === 'Present') {
                    formattedData[classname].presentCount++;
                } else {
                    formattedData[classname].absentCount++;
                }
            }
        });

        // Calculate percentages and push status data for each class
        for (const classname in formattedData) {
            const { presentCount, absentCount, dates, statusData } = formattedData[classname];
            formattedData[classname].percentage = calculatePercentage(presentCount, absentCount, dates.length);
            formattedData[classname].statusDataArray = dates.map(date => ({ date, status: statusData[date] }));
        }

        return formattedData;
    }

    // Function to calculate percentage
    function calculatePercentage(presentCount, absentCount, totalDays) {
        if (totalDays === 0) {
            return 'N/A';
        }

        const percentage = (presentCount / totalDays) * 100;
        return percentage.toFixed(2) + '%';
    }

    try {
        const { uid } = req.params;

        const getAttendanceQuery = `
            SELECT c.classname, DATE_FORMAT(a.date, '%Y-%m-%d') as date, a.status
            FROM class c
            LEFT JOIN attendance a ON c.cid = a.cid
            WHERE a.uid = ?`;

        db.query(getAttendanceQuery, [uid], (err, results) => {
            if (err) {
                // console.error('Error fetching attendance records:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            const formattedData = formatAttendanceData(results);
            res.status(200).json({ attendance: formattedData });
        });
    } catch (error) {
        // console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getDetails/:uid', (req, res) => {
    const { uid } = req.params;
    const getUserDetailsQuery = `
    SELECT uid, firstName, lastName, rollno, email, DATE_FORMAT(dob, '%Y-%m-%d') as dob, gender, nationality, address, phoneNo
    FROM student_details
    WHERE uid = ?`;
    db.query(getUserDetailsQuery, [uid], (err, results) => {
        if (err) {
            // console.error('Error fetching user details:', err);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            if (results.length === 0) {
                res.status(404).json({ error: 'User not found' });
            } else {
                const userDetails = results[0];
                res.status(200).json(userDetails);
            }
        }
    });
});

app.listen(8000, () => {
    console.log("Listening...")
})