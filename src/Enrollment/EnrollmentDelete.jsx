/* eslint-disable react/prop-types */
// DeleteEnrollment.js
import{ useContext } from 'react';
import { EnrollmentContext } from './EnrollmentContext';

const EnrollmentDelete = ({ courseId, enrollmentId }) => {
    const { deleteEnrollment, loading, error, message } = useContext(EnrollmentContext);

    const handleDelete = () => {
        deleteEnrollment(courseId, enrollmentId);
    };

    return (
        <>
            <button onClick={handleDelete}>Delete Enrollment</button>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {message && <p>{message}</p>}
        </>
    );
};

export default EnrollmentDelete;