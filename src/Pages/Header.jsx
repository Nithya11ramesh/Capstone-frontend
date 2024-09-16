 
 
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../ContextAPI/AuthContext';
import { EnrollmentContext } from '../ContextAPI/EnrollmentContext';
import './Header.css'; // Import your CSS file here


const Header = () => {
    const { users, logout } = useContext(AuthContext); // Make sure AuthContext is correctly imported and provided
    const { enrollments, fetchEnrollmentByUser, loading, error } = useContext(EnrollmentContext);
    const [filteredEnrollments, setFilteredEnrollments] = useState([]);
    const [showSmartBar, setShowSmartBar] = useState(true);
  
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    
    };
    
    const handleCloseSmartBar = () => {
        setShowSmartBar(false);
    };
    
    useEffect(() => {
        if (users && users.userId) {
            fetchEnrollmentByUser(users.userId);
        }
    }, [users]);

    useEffect(() => {
        if (Array.isArray(enrollments) && users && users.userId) {
            const filtered = enrollments.filter(enrollment => enrollment.user && enrollment.user._id === users.userId);
            setFilteredEnrollments(filtered);
        }
    }, [enrollments, users]);

    const handleNavigate = (path) => {
        navigate(path);
    };
   
return (
    <>
        {showSmartBar && (
            <div className="smart-bar">
                <span>
                    It’s the last day to save! So choose learning that fits your lifestyle, with courses from ₹44999.
                </span>
                &nbsp;&nbsp;&nbsp;
                <Button onClick={handleCloseSmartBar} className="btn-close">
                    
                </Button>
            </div>
        )}

        <Navbar expand="lg" className="navbar sticky-top navbar-dark bg-body-tertiary p-0">
            <Container fluid className="py-2" style={{ fontSize: '1rem', backgroundColor: 'black', color: 'white', height: 'fit-content' }}>
                <Navbar.Brand as={Link} to="/" style={{ color: '#ffff', fontSize: '1.6rem' }}>
                    <img src="https://clipart.com/thumbs.php?f=/599/batch_05/000599-0005-000009_tnb.png" style={{ width: '40%', maxWidth: '50px', resizeMode: 'contain', border: "1px solid brown", padding: "1px" }} className="rounded-circle" alt="..." />
                    &nbsp; SMARTLEARN
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarSupportedContent" />
                <Navbar.Collapse id="navbarSupportedContent">
                    <Nav className="me-auto mb-2 mb-lg-0" style={{ color: 'white' }}>
                        {!users && (
                            <>
                                <Nav.Link as={Link} to="/home"style={{
                    backgroundColor: 'pink',
                    color: 'black',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    marginRight: '10px',
                    textDecoration: 'none',
                    border:'1px solid black'
                }}>Home</Nav.Link>
                &nbsp;
                                <Nav.Link as={Link} to="/about"style={{
                    backgroundColor: 'pink',
                    color: 'black',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    marginRight: '10px',
                    textDecoration: 'none',
                    border:'1px solid black'
                }}>About</Nav.Link>
                &nbsp;
                                <Nav.Link as={Link} to="/courses"style={{
                    backgroundColor: 'pink',
                    color: 'black',
                    padding: '10px 20px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    marginRight: '10px',
                    textDecoration: 'none',
                    border:'1px solid black'
                }}>Courses</Nav.Link>
                            </>
                        )}
                        {users && users.role === 'admin' && (
                            <>
                                <Nav.Link as={Link} to="/users-details">Users</Nav.Link>
                                <Nav.Link as={Link} to="/courses">Courses-Management</Nav.Link>
                                <Nav.Link as={Link} to="/enroll">Enrollments</Nav.Link>
                                <div className="mt-auto">
                                    <button className="nav-link" onClick={() => window.history.back()}>Back</button>
                                </div>
                            </>
                        )}
                        {users && users.role === 'instructor' && (
                            <>
                                <Nav.Link as={Link} to="/courses">Courses-Management</Nav.Link>
                                <div className="mt-auto">
                                    <button className="nav-link" onClick={() => window.history.back()}>Back</button>
                                </div>
                            </>
                        )}
                        {users && users.role === 'student' && (
                            <>
                                <Nav.Link as={Link} to="/courses">Courses</Nav.Link>
                                <ul className="navbar-nav me-auto mb-lg-0">
                                    <Nav.Link as={Link} to="/student-dashboard" className="nav-link">Profile</Nav.Link>
                                    {filteredEnrollments.map(enrollment => (
                                        <React.Fragment key={enrollment._id}>
                                            <Nav.Link as={Link} to={`/assignments/${enrollment.course?._id}`} className="nav-link">Assignments</Nav.Link>
                                            <Nav.Link as={Link} to={`/quizzes/${enrollment.course?._id}`} className="nav-link">Quizzes</Nav.Link>
                                            <Nav.Link as={Link} to={`/lessons/${enrollment.course?._id}`} className="nav-link">Lessons</Nav.Link>
                                            <Nav.Link as={Link} to={`/progress-report/${enrollment.course?._id}`} className="nav-link">Progress Report</Nav.Link>
                                        </React.Fragment>
                                    ))}
                                </ul>
                                <div className="mt-auto">
                                    <button className="nav-link" onClick={() => window.history.back()}>Back</button>
                                </div>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
                <div className="d-flex align-items-center">
                    {users ? (
                        <>
                            <span className="me-2">{users.firstName} {users.lastName} ({users.role})</span>
                            <Link to="/student-dashboard" className="btn btn-info me-2">Profile</Link>
                            <button onClick={handleLogout} className="btn btn-outline-danger me-2">
                                <i className="bi bi-box-arrow-right"></i> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-primary me-2">Login</Link>
                            <Link to="/register" className="btn btn-secondary">Register</Link>
                        </>
                    )}
                </div>
            </Container>
        </Navbar>
    </>
);
};

export default Header;