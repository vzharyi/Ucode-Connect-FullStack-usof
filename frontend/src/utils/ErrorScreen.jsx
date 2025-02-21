import React from 'react';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {keyframes} from "@mui/material";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const shakeAnimation = keyframes`
  10%, 90% { transform: translateX(-1px); }
  20%, 80% { transform: translateX(2px); }
  30%, 50%, 70% { transform: translateX(-4px); }
  40%, 60% { transform: translateX(4px); }
`;

const ErrorScreen = ({ error }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                textAlign: 'center',
                color: '#d32f2f',
                animation: `${shakeAnimation} 0.8s ease-in-out`,
            }}
        >
            <ErrorOutlineIcon sx={{ fontSize: 80, mb: 2 }} />
            <Typography variant="h5" sx={{ mb: 1 }}>
                Something went wrong...
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
                {error}
            </Typography>
        </Box>
    );
};

export default ErrorScreen;
