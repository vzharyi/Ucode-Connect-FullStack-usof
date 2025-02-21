import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { verifyEmail } from '../../redux/actions/authActions';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from "@mui/material/styles";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const AnimatedCheckmark = styled(CheckCircleIcon)(({ theme }) => ({
    fontSize: 64,
    color: '#4caf50',
    opacity: 0,
    transform: 'scale(0)',
    animation: 'checkmarkAnimation 0.8s ease-in-out forwards',
    '@keyframes checkmarkAnimation': {
        '0%': {
            opacity: 0,
            transform: 'scale(0)',
        },
        '50%': {
            opacity: 1,
            transform: 'scale(1.2)',
        },
        '100%': {
            opacity: 1,
            transform: 'scale(1)',
        },
    },
}));

const AnimatedCross = styled(CancelIcon)(({ theme }) => ({
    fontSize: 64,
    color: '#f44336', 
    opacity: 0,
    transform: 'scale(0)',
    animation: 'crossAnimation 0.8s ease-in-out forwards',
    '@keyframes crossAnimation': {
        '0%': {
            opacity: 0,
            transform: 'scale(0)',
        },
        '50%': {
            opacity: 1,
            transform: 'scale(1.2)',
        },
        '100%': {
            opacity: 1,
            transform: 'scale(1)',
        },
    },
}));

const CustomAlert = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    color: '#000',
    borderRadius: '8px',
    padding: '8px 16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    fontWeight: 'bold',
    fontSize: '16px',
    fontFamily: theme.typography.fontFamily,
}));

const VerifyEmailPage = () => {
    const dispatch = useDispatch();
    const { confirm_token } = useParams();
    const [forceLoading, setForceLoading] = useState(true);
    const [showIcon, setShowIcon] = useState(false);
    const { emailVerificationSuccess, error } = useSelector((state) => ({
        emailVerificationSuccess: state.auth.emailVerificationSuccess,
        error: state.auth.error,
    }));

    useEffect(() => {
        if (confirm_token) {
            dispatch(verifyEmail(confirm_token));
        }
    }, [confirm_token, dispatch]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setForceLoading(false);
            setTimeout(() => setShowIcon(true)); 
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (emailVerificationSuccess) {
            setTimeout(() => {
                window.location.replace('/posts'); 
            }, 7000); 
        }
    }, [emailVerificationSuccess]);

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                padding: 2,
            }}
        >
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                }}
            >
                {forceLoading && (
                    <CircularProgress
                        size={50}
                        sx={{
                            position: 'absolute',
                            color: '#000000',
                            transition: 'opacity 0.5s ease-out',
                            opacity: showIcon ? 0 : 1,
                        }}
                    />
                )}
                {showIcon && emailVerificationSuccess && <AnimatedCheckmark />}
                {showIcon && error && <AnimatedCross />}
            </Box>
            <Box
                sx={{
                    height: '50px', 
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Typography sx={{
                    mt: 2,
                    color: '#000',
                    fontSize: '16px', 
                    fontWeight: 'bold', 
                }}>
                    {forceLoading
                        ? 'Verifying your email...'
                        : emailVerificationSuccess
                            ? <CustomAlert severity="success" sx={{ mb: 2, backgroundColor: '#f3fdf0', }}>
                                Your email has been successfully verified!<br />
                                Redirecting to your account in a few seconds...
                            </CustomAlert>
                            : <CustomAlert severity="error" sx={{ mb: 2, backgroundColor: '#fbebeb', }}>
                                {error || 'An error occurred, please try again.'}
                            </CustomAlert>}
                </Typography>
            </Box>
        </Box>
    );
};

export default VerifyEmailPage;
