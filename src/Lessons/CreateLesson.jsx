

import { useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { message } from 'antd';
import { Container, TextField, Button, Typography, Box, Card } from '@mui/material';
import { LessonContext } from '../ContextAPI/LessonContext';

const CreateLesson = () => {
    const { courseId } = useParams(); // Get courseId for creating a new lesson
    const { createLesson, fetchLessonById } = useContext(LessonContext);
    const [lesson, setLesson] = useState({
        session: '',
        description: '',
        url: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLesson(prevLesson => ({
            ...prevLesson,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Create the lesson
            const createdLesson = await createLesson(courseId, lesson);

            // Fetch the created lesson details by its ID
            if (createdLesson && createdLesson._id) {
                const fetchedLesson = await fetchLessonById(createdLesson._id);
                if (fetchedLesson) {
                    message.success('Lesson created and fetched successfully!');
                    navigate(`/lesson/${fetchedLesson._id}`); // Navigate to lesson detail page
                }
            } else {
                message.success('Lesson created successfully!');
                navigate(-1);
            }
        } catch (error) {
            console.error('Error submitting lesson:', error);
            message.error('Failed to submit lesson.');
        }
    };

    return (
        <Container sx={{ minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Card sx={{ padding: '24px', maxWidth: '800px', margin: 'auto' }}>
                <Typography variant="h4" component="h2" gutterBottom align='center'>
                    Create Lesson
                </Typography>
                <form onSubmit={handleSubmit}>
                    <table style={{ width: '100%' }}>
                        <tbody>
                            <tr>
                                <td>
                                    <Typography variant="subtitle1">Session</Typography>
                                </td>
                                <td>
                                    <TextField
                                        fullWidth
                                        name="session"
                                        value={lesson.session}
                                        onChange={handleChange}
                                        placeholder="Enter session"
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Typography variant="subtitle1">Description</Typography>
                                </td>
                                <td>
                                    <TextField
                                        fullWidth
                                        name="description"
                                        value={lesson.description}
                                        onChange={handleChange}
                                        placeholder="Enter description"
                                        multiline
                                        minRows={3}
                                        required
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Typography variant="subtitle1">Video URL</Typography>
                                </td>
                                <td>
                                    <TextField
                                        fullWidth
                                        name="url"
                                        value={lesson.url}
                                        onChange={handleChange}
                                        placeholder="Enter YouTube video URL"
                                    />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan="2" align="center">
                                    <Box mt={3}>
                                        <Button variant="contained" color="primary" type="submit">
                                            Create Lesson
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => navigate(-1)}
                                            style={{ marginLeft: '16px' }}
                                        >
                                            Back
                                        </Button>
                                    </Box>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </Card>
        </Container>
    );
};

export default CreateLesson;
