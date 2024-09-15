import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { CircularProgress, Typography, Box, Container } from '@mui/material';

const PaymentSuccessPage = () => {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const paymentIntentId = query.get('payment_intent');
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the payment intent details to confirm the status
        if (paymentIntentId) {
            axios.get(`https://capstone-backend-05tj.onrender.com/apiPayments/payment-status/${paymentIntentId}`)
                .then(response => {
                    setPaymentStatus(response.data.status);
                    setLoading(false);
                })
                .catch(error => {
                    setError('Error fetching payment status');
                    console.error('Error fetching payment status:', error);
                    setLoading(false);
                });
        } else {
            setError('No payment intent ID found.');
            setLoading(false);
        }
    }, [paymentIntentId]);

    if (loading) {
        return (
            <Container>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                    <Typography sx={{ ml: 2 }}>Processing your payment...</Typography>
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
                    <Typography variant="h4" color="error">{error}</Typography>
                </Box>
            </Container>
        );
    }

    return (
        <Container>
            <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
                {paymentStatus === 'succeeded' ? (
                    <Typography variant="h4" color="success.main">
                        Payment successful! Thank you for your purchase.
                    </Typography>
                ) : (
                    <Typography variant="h4" color="error.main">
                        Payment failed or is still processing. Please check your email for confirmation.
                    </Typography>
                )}
            </Box>
        </Container>
    );
};

 export default PaymentSuccessPage;
