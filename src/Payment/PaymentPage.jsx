import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { message } from "antd";
import { CardActionArea, CardContent, CardMedia, Typography, Button } from "@mui/material";
import { Container, Card } from 'react-bootstrap';
import { useParams, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';

const stripePromise = loadStripe("pk_test_51Pt9giP4khmHONAmh5JOVUHEry5uSLv47rMA1M0jxM1ZNukurt2Nnj1Gky9rsTTDjeMZI4QUIZynkC5ZAxBNfjk200KAlhp5K5");

const PaymentPage = () => {
    const { enrollmentId } = useParams(); // Get enrollmentId from URL parameters
    const location = useLocation();
    const price = location.state?.price; // Ensure price is in dollars
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !enrollmentId || !price) {
            message.error('Enrollment ID or price is missing.');
            setLoading(false);
            return;
        }

        setLoading(true);

        const cardElement = elements.getElement(CardElement);

        try {
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card: cardElement,
            });

            if (error) {
                message.error(error.message);
                setLoading(false);
                return; // Stop further execution on error
            }

            const amountToSend = price; // Amount in dollars

            const response = await axios.post(`http://localhost:5000/apiPayments/payment/${enrollmentId}`, {
                payment_method_id: paymentMethod.id,
                amount: amountToSend, // Send amount in dollars
                enrollment_id: enrollmentId,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.data.error) {
                message.error(response.data.error.message);
                setLoading(false); // Make sure the loading state is reset
                return; // Stop further execution if there's an error from backend
            } else {
                message.success('Payment successful!');

                // Update payment status to "paid" in the backend
                await axios.put(`http://localhost:5000/apiPayments/update-payment-status/${enrollmentId}`, {}, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                // Navigate to the profile page after successful payment
                navigate('/profile');
            }
        } catch (err) {
            console.error('Payment Error:', err);
            // message.error('Payment failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Card sx={{ maxWidth: 345 }}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        height="300"
                        image="https://www.shutterstock.com/shutterstock/photos/2132665833/display_1500/stock-photo-bank-customer-woman-using-credit-card-mobile-phone-shopping-online-with-ecommerce-application-2132665833.jpg"
                        alt="Payment"
                    />
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Typography gutterBottom variant="h5" component="div">
                                Payment Details
                            </Typography>
                            <CardElement />
                            <Button
                                type="submit"
                                variant="contained"
                                color="success"
                                fullWidth
                                disabled={!stripe || loading}
                                sx={{ mt: 2 }}
                            >
                                {loading ? 'Processing...' : 'Pay'}
                            </Button>
                        </form>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Container>
    );
};

const PaymentWrapper = (props) => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentPage {...props} />
        </Elements>
    );
};

export default PaymentWrapper;
