import React from 'react';
import {keyframes} from "@mui/material";

import Box from '@mui/material/Box';

const bounceAnimation = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const LoadingDots = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Box
                sx={{
                    width: 10,
                    height: 10,
                    backgroundColor: '#000000',
                    borderRadius: '50%',
                    animation: `${bounceAnimation} 1.4s infinite ease-in-out`,
                    animationDelay: '0s',
                    margin: '0 5px',
                }}
            />
            <Box
                sx={{
                    width: 10,
                    height: 10,
                    backgroundColor: '#000000',
                    borderRadius: '50%',
                    animation: `${bounceAnimation} 1.4s infinite ease-in-out`,
                    animationDelay: '0.2s',
                    margin: '0 5px',
                }}
            />
            <Box
                sx={{
                    width: 10,
                    height: 10,
                    backgroundColor: '#000000',
                    borderRadius: '50%',
                    animation: `${bounceAnimation} 1.4s infinite ease-in-out`,
                    animationDelay: '0.4s',
                    margin: '0 5px',
                }}
            />
        </Box>
    );
};

export default LoadingDots;
