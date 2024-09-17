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
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    // Function to fetch all users
    const getAllUsers = async () => {
        try {
            const token = JSON.parse(localStorage.getItem('user'))?.token;
            if (!token) {
                console.error('Authentication token missing. Please log in again.');
                return;
            }

            const response = await axios.get('https://capstone-backend-05tj.onrender.com/apiUsers/users', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUsersDetails(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users.');
        }
    };

    // Fetch logged-in user's details
    const fetchUserDetails = async () => {
        const userData = JSON.parse(localStorage.getItem('user'));
        const token = userData?.token;

        if (token) {
            try {
                const response = await axios.get('https://capstone-backend-05tj.onrender.com/apiUsers/user/details', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                console.log('User details fetched successfully:', response.data);
                setUsers(response.data); // Assuming response.data contains the user data
            } catch (error) {
                console.error('Error fetching user details:', error);
            }
        } else {
            console.error('No token found');
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
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setUsers(loggedInUser);
        }
    }, []);

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
