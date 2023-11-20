CREATE DATABASE sms;
USE sms;

CREATE TABLE users (
    uid INT AUTO_INCREMENT PRIMARY KEY,
    emailid VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role INT NOT NULL CHECK (role IN (0, 1))
);

CREATE TABLE student_details (
    uid INT PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    rollno VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    dob DATE NOT NULL,
    gender VARCHAR(10),
    nationality VARCHAR(50),
    address VARCHAR(255),
    phoneNo VARCHAR(20)
);

CREATE TABLE class (
    cid INT PRIMARY KEY,
    classname VARCHAR(255) NOT NULL
);
	
CREATE TABLE attendance (
    uid INT,
    rollno VARCHAR(50),
    cid INT,
    date DATE,
    status VARCHAR(10) CHECK (status IN ('Present', 'Absent')),
    FOREIGN KEY (uid) REFERENCES users(uid),
    FOREIGN KEY (cid) REFERENCES class(cid),
    PRIMARY KEY (uid, cid, date)
);

SELECT  * FROM users;
SELECT  * FROM student_details;
SELECT  * FROM class;
SELECT  * FROM attendance;

INSERT INTO users (uid, emailid, password, role) VALUES (1, 'admin@gmail.com', '1234', 1);
INSERT INTO users (uid, emailid, password, role) VALUES (2, 'glad@gmail.com', '1234', 0);
INSERT INTO users (uid, emailid, password, role) VALUES (3, 'muthu@gmail.com', '1234', 0);

INSERT INTO student_details (uid, firstName, lastName, rollno, email, dob, gender, nationality, address, phoneNo)
VALUES
  (2, 'Gladwin', 'A J', '2105018', 'glad@gmail.com', '2001-02-02', 'Male', 'Indian', '456 Oak Avenue, Town', '987-654-3210'),
  (3, 'Muthu Jawahar', 'K', '2105041', 'muthu@gmail.com', '2000-01-01', 'Male', 'Indian', '123 Main Street, City', '123-456-7890');

INSERT INTO class (cid, classname) VALUES (1, 'Science');
INSERT INTO class (cid, classname) VALUES (2, 'Maths');
INSERT INTO class (cid, classname) VALUES (3, 'English');
INSERT INTO class (cid, classname) VALUES (4, 'Tamil');
INSERT INTO class (cid, classname) VALUES (5, 'Social Science');

INSERT INTO attendance (uid, rollno, cid, date, status)
VALUES
  (2, '2105018', 1, '2023-11-11', 'Present'),
  (2, '2105018', 2, '2023-11-11', 'Present'),
  (2, '2105018', 3, '2023-11-11', 'Present'),
  (2, '2105018', 4, '2023-11-11', 'Present'),
  (2, '2105018', 5, '2023-11-11', 'Present');

INSERT INTO attendance (uid, rollno, cid, date, status)
VALUES
  (3, '2105041', 1, '2023-11-11', 'Present'),
  (3, '2105041', 2, '2023-11-11', 'Present'),
  (3, '2105041', 3, '2023-11-11', 'Present'),
  (3, '2105041', 4, '2023-11-11', 'Absent'),
  (3, '2105041', 5, '2023-11-11', 'Present');

INSERT INTO attendance (uid, rollno, cid, date, status)
VALUES
  (2, '2105018', 1, '2023-11-12', 'Present'),
  (2, '2105018', 2, '2023-11-12', 'Absent'),
  (2, '2105018', 3, '2023-11-12', 'Present'),
  (2, '2105018', 4, '2023-11-12', 'Present'),
  (2, '2105018', 5, '2023-11-12', 'Present');

INSERT INTO attendance (uid, rollno, cid, date, status)
VALUES
  (3, '2105041', 1, '2023-11-12', 'Present'),
  (3, '2105041', 2, '2023-11-12', 'Absent'),
  (3, '2105041', 3, '2023-11-12', 'Absent'),
  (3, '2105041', 4, '2023-11-12', 'Present'),
  (3, '2105041', 5, '2023-11-12', 'Present');

INSERT INTO attendance (uid, rollno, cid, date, status)
VALUES
  (2, '2105018', 1, '2023-11-13', 'Present'),
  (2, '2105018', 2, '2023-11-13', 'Present'),
  (2, '2105018', 3, '2023-11-13', 'Present'),
  (2, '2105018', 4, '2023-11-13', 'Present'),
  (2, '2105018', 5, '2023-11-13', 'Present');

INSERT INTO attendance (uid, rollno, cid, date, status)
VALUES
  (3, '2105041', 1, '2023-11-13', 'Present'),
  (3, '2105041', 2, '2023-11-13', 'Present'),
  (3, '2105041', 3, '2023-11-13', 'Present'),
  (3, '2105041', 4, '2023-11-13', 'Absent'),
  (3, '2105041', 5, '2023-11-13', 'Present');

DELETE FROM attendance WHERE uid = 8;
