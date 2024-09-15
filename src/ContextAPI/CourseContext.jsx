/* eslint-disable react/prop-types */
import  { createContext, useEffect, useState } from 'react';
import axios from 'axios';
export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState();

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const response = await axios.get('https://capstone-backend-05tj.onrender.com/apiCourses/getCourses', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setCourses(response.data);
            setLoading(false);
        } catch (err) {
            if (err.response && err.response.status === 401) {
                setError('Unauthorized. Please log in.');
                // Add logic to handle unauthorized access (e.g., redirect to login)
            } else {
                setError(err.message || 'An error occurred.');
            }
            setLoading(false);
        }
    };

    // Fetch a single course by ID
    const fetchCourseById = async (courseId) => {
        setLoading(true);
        try {
            const response = await axios.get(`https://capstone-backend-05tj.onrender.com/apiCourses/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setCurrentCourse(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Failed to fetch course.');
            setLoading(false);
            console.error("Error:", err)
        }
    };
    useEffect(() => {
        fetchCourses();
    }, []);

    // Create a new course
    const createCourse = async (courseData, mediaFiles) => {
        setLoading(true);
        try {

            const formData = new FormData();
            Object.keys(courseData).forEach((key) => {
                formData.append(key, courseData[key]);
            });
            if (mediaFiles) {
                for (let file of mediaFiles) {
                    formData.append('media', file);
                }
            }
            const response = await axios.post('https://capstone-backend-05tj.onrender.com/apiCourses', formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            // setCourses([...courses, response.data.course]);
            setCourses((prevCourses) => [...prevCourses, response.data.course]);
            setMessage("Course Created Successfully..!");
            fetchCourses();
        } catch (err) {
            console.error("Error:", err)
            setError(err.message);
        }finally{
            setLoading(false);
        }
    };

    const updateCourse = async (courseId, updatedData, mediaFiles = []) => {
        setLoading(true);
        try {

            const formData = new FormData();
            Object.keys(updatedData).forEach((key) => {
                formData.append(key, updatedData[key]);
            });
            if (mediaFiles) {
                for (let file of mediaFiles) {
                    formData.append('media', file);
                }
            }

            const response = await axios.put(`https://capstone-backend-05tj.onrender.com/apiCourses/${courseId}`, formData, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });

            const updatedCourses = courses.map(course => course._id === courseId ? response.data : course);
            setCourses(updatedCourses);
            setLoading(false);
            setMessage("Course Updated Successfully!");
        } catch (err) {
            setError(err.message || 'Failed to update course.');
            setLoading(false);
            console.error("Error:", err);
        }
    };

    // Delete a course by ID
    const deleteCourse = async (courseId) => {
        setLoading(true);
        try {
            await axios.delete(`https://capstone-backend-05tj.onrender.com/apiCourses/${courseId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
            const updatedCourses = courses.filter((course) => course._id !== courseId);
            setCourses(updatedCourses);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };
    return (
        <CourseContext.Provider value={{
            courses,
            currentCourse,
            fetchCourses,
            fetchCourseById,
            createCourse,
            updateCourse,
            deleteCourse,
            loading,
            error,
            message
        }}>
            {children}
        </CourseContext.Provider>
    );
};