import React from 'react';
import { Avatar, Box, Button, Tooltip, Typography } from '@mui/material';
import {useLocation} from "react-router-dom";

const API_BASE_URL = 'http://localhost:8080';

const UserCard = ({ user, onCardClick, onUpdateProfile, currentUserId, isClickable = true  }) => {
    const location = useLocation(); 
    return (
        <Box
            onClick={isClickable ? () => onCardClick(user.id) : undefined} 
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                maxWidth: '200px',
                margin: '0 auto',
                position: 'relative',
                cursor: isClickable ? 'pointer' : 'default', 
                '&:hover': isClickable
                    ? {
                        boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                        transform: 'scale(1.02)',
                        transition: 'all 0.3s ease',
                    }
                    : undefined,
            }}
        >
            <Tooltip title="User rating" arrow>
                <Box sx={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '1px' }}>
                    <img
                        src={`${API_BASE_URL}/uploads/image/rating.png`}
                        alt="Rating"
                        style={{ width: 25, height: 25 }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {user.rating || 0}
                    </Typography>
                </Box>
            </Tooltip>
            <Avatar
                alt={user.full_name}
                src={`${API_BASE_URL}${user.profile_picture}`}
                sx={{ width: 200, height: 200, marginBottom: 2 }}
            />
            <Tooltip title="Full name" arrow placement="right">
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#343a40', mb: 1, cursor: 'pointer' }}>
                    {user.full_name}
                </Typography>
            </Tooltip>
            <Tooltip title="Login" arrow placement="right">
                <Typography variant="body1" sx={{ color: '#868e96', cursor: 'pointer' }}>
                    {user.login}
                </Typography>
            </Tooltip>
            <Tooltip title="Email" arrow placement="right">
                <Typography variant="body1" sx={{ color: '#868e96', cursor: 'pointer' }}>
                    {user.email}
                </Typography>
            </Tooltip>

            {currentUserId === user.id && location.pathname === '/profile' && (
                <>
                    <Button
                        variant="contained"
                        sx={{
                            fontSize: '14px',
                            background: 'linear-gradient(to bottom, #1a1a1a, #000)',
                            fontWeight: 'bold',
                            padding: '6px 12px',
                            borderRadius: '10px',
                            color: '#e3e3e3',
                            '&:hover': {
                                background: 'linear-gradient(to bottom, #2a2a2a, #333)',
                                color: '#ffffff',
                            },
                        }}
                        size="small"
                        onClick={onUpdateProfile} 
                    >
                        Update Profile
                    </Button>
                </>
            )}
        </Box>
    );
};

export default UserCard;
