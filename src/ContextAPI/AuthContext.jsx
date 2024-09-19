/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [users, setUsers] = useState(null);
    const [usersDetails, setUsersDetails] = useState(null);
    const [instructors, setInstructors] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [message, setMessage] = useState();

    // Function to fetch all users
    const getAllUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get('https://capstone-backend-05tj.onrender.com/apiUsers/users', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.data && Array.isArray(response.data)) {
                setUsersDetails(response.data);
                //console.log("Users Details:", response.data); // Check data format
            } else {
                console.warn("Unexpected response format:", response.data); // Debug output
            }
        } catch (err) {
            console.error('User Fetching user:', err.response ? err.response.data : err.message);
            setError(err.message || 'Failed to fetch users.');
            setLoading(false);
        }
    };

    const fetchUserDetails = async () => {
        try {
         const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.get('https://capstone-backend-05tj.onrender.com/apiUsers/user/details', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
           
            setUsers(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
            console.error('Error fetching user details:', error);
            setError(error.response ? error.response.data.message : error.message);
        }
    };
    
    
    // Update user details
    const updateUserDetails = async (updatedDetails) => {
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.put('https://capstone-backend-05tj.onrender.com/apiUsers/user/update', updatedDetails, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setUsers(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
            console.error("Error updating user details:", error);
        } finally {
            setLoading(false);
        }
    };

    // Login function
    const login = async (credentials) => {
        try {
            const response = await axios.post('https://capstone-backend-05tj.onrender.com/apiUsers/login', credentials, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const userData = { ...response.data.user, token: response.data.token };
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('token',response.data.token);
            setUsers(userData);
            console.log('Login successful. User data:', userData);
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed. Please check your credentials.');
        }
    };

    // Logout function
    const logout = () => {
        setUsers(null);
       
        localStorage.removeItem('user');
        localStorage.removeItem('token'); // In case you're storing the token separately

        console.log('User logged out.');
    };

    // Forgot Password function
    const forgotPassword = async (email) => {
        try {
            const response = await axios.post('https://capstone-backend-05tj.onrender.com/apiUsers/forgot-password', { email }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response ? error.response.data.message : 'Error occurred' };
        }
    };

    // Reset Password function
    const resetPassword = async (token, password) => {
        try {
            const response = await axios.post(`https://capstone-backend-05tj.onrender.com/apiUsers/reset-password/${token}`, { password }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            return { success: true, message: response.data.message };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Error resetting password' };
        }
    };

    // Fetch instructors list
    const fetchInstructors = async () => {
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            const response = await axios.get('https://capstone-backend-05tj.onrender.com/apiUsers/user/instructor', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setInstructors(response.data);
        } catch (error) {
            console.error("Error fetching instructor details:", error);
        } finally {
            setLoading(false);
        }
    };

    // Check for logged-in user on page load
    // useEffect(() => {
    //     const loggedInUser = JSON.parse(localStorage.getItem('user'));
    //     if (loggedInUser) {
    //         setUsers(loggedInUser);
    //     }
    // }, []);

    // Fetch user details on initial render
    useEffect(() => {
        
            fetchUserDetails();
        
    }, []);
    return (
        <AuthContext.Provider
            value={{
                users,
                login,
                logout,
                forgotPassword,
                resetPassword,
                getAllUsers,
                usersDetails,
                fetchUserDetails,
                fetchInstructors,
                updateUserDetails,
                loading,
                error,
                instructors,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};