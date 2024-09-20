
/* eslint-disable react-hooks/exhaustive-deps */
// /* eslint-disable react-hooks/exhaustive-deps */





import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../ContextAPI/AuthContext';
import axios from 'axios';
import { message } from 'antd';
import { Container, Button, TextField, Table, TableHead, TableBody, TableRow, TableCell, TableContainer, Paper } from '@mui/material';

const Users = () => {
    const { usersDetails, getAllUsers } = useContext(AuthContext);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editing, setEditing] = useState(false);

    // useEffect(() => {
    //     getAllUsers(); // Fetch all users on component mount
    // }, []);
    useEffect(() => {
        if (getAllUsers) {
            getAllUsers(); // Fetch all users on component mount
        } else {
            console.error('getAllUsers function is not available from AuthContext.');
        }
    }, []);

    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditing(true);
    };
    const handleDelete = async (userId) => {
        try {
            // Confirm before deleting
            const confirmDelete = window.confirm("Are you sure you want to delete this user?");
            if (!confirmDelete) return;


            const token = JSON.parse(localStorage.getItem('user'))?.token;
            if (!token) {
                return message.error('Authentication token missing. Please log in again.');
            }
            await axios.delete(`https://capstone-backend-05tj.onrender.com/apiUsers/users/${userId}`, {
                headers: {
                    Authorization:`Bearer ${token}`,
                },
            });
            message.success("User Deleted.");
            getAllUsers(); // Refresh the user list
        } catch (error) {
            console.error('Error deleting user:', error);
            message.error("Failed to Delete.");
        }
    };

    
    const handleUpdate = async () => {
        try {
            await axios.put(`https://capstone-backend-05tj.onrender.com/apiUsers/users/${selectedUser._id}`, selectedUser, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            getAllUsers(); // Refresh the user list
            setEditing(false);
            setSelectedUser(null);
            message.success("User Updated.")
        } catch (error) {
            console.error('Error updating user:', error);
            message.error("Failed to update.")
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    return (
        <Container style={{ padding: '1rem' }}>
            <h1 className='pacifico-regular' style={{ textAlign: 'center', paddingBottom: '30px' }}>Users Management</h1>

            {editing && selectedUser && (
                <div style={{ marginTop: '2rem', marginBottom: '2rem', backgroundColor: 'white', padding: '1rem' }}>
                    <h2 className='pacifico-regular' style={{ textAlign: 'center', paddingBottom: '30px', color: 'darkcyan' }}>Edit User</h2>
                    <form>
                        <TextField
                            label="First Name"
                            name="firstName"
                            value={selectedUser.firstName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Last Name"
                            name="lastName"
                            value={selectedUser.lastName}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Email"
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Role"
                            name="role"
                            value={selectedUser.role}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                        <div style={{ marginTop: '1rem' }}>
                            <Button onClick={handleUpdate} variant="contained" color="primary" style={{ marginRight: '1rem' }}>
                                Update
                            </Button>
                            <Button onClick={() => setEditing(false)} variant="outlined" color="secondary">
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {usersDetails && Array.isArray(usersDetails) && (
                <TableContainer component={Paper} >
                    <Table>
                        <TableHead>
                            <TableRow  style={{ backgroundColor: '#333', color: '#fff' }} >
                                <TableCell style={{ color: '#fff' }}>First Name</TableCell>
                                <TableCell style={{ color: '#fff' }}>Last Name</TableCell>
                                <TableCell style={{ color: '#fff' }}>Email</TableCell>
                                <TableCell style={{ color: '#fff' }}>Role</TableCell>
                                <TableCell style={{ color: '#fff' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {usersDetails.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.firstName}</TableCell>
                                    <TableCell>{user.lastName}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => handleEdit(user)}
                                            variant="outlined"
                                            color="warning"
                                            size="small"
                                            style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(user._id)}
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            style={{ marginRight: '0.5rem', marginBottom: '0.5rem' }}

                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default Users;