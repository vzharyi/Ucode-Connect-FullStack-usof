import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiInputLabel-root': {
                        color: '#000',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#000',
                    },
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        '&:hover fieldset': {
                            borderColor: '#000',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#000',
                        },
                    },
                },
            },
        },
    },
});

const styles = {
    modalBox: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        padding: 2,
        backgroundColor: 'white',
        borderRadius: 2,
        boxShadow: 24,
    },
    input: {
        marginBottom: 2,
    },
};

const containedButtonStyle = {
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
};

const buttonStyle = {
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '6px 12px',
    borderRadius: '10px',
    color: '#46526a',
    border: '1px solid #000',
    '&:hover': {
        backgroundColor: '#e9ecf2',
        color: '#000',
    },
};

const UpdateCommentModal = ({ open, handleClose, comment, onSubmit }) => {
    const [content, setContent] = useState(''); 
    const [contentError, setContentError] = useState(false);

    useEffect(() => {
        if (comment) {
            setContent(comment.content); 
        }
    }, [comment]); 

    const handleContentChange = (e) => {
        setContent(e.target.value);
        if (e.target.value.trim() === '') {
            setContentError(true);
        } else {
            setContentError(false);
        }
    };

    const handleSubmit = () => {
        if (content.trim() === '') {
            setContentError(true);
            return;
        }
        onSubmit(content); 
        handleClose(); 
    };

    const handleCancel = () => {
        handleClose(); 
    };

    return (
        <ThemeProvider theme={theme}>
            <Modal open={open} onClose={handleClose} aria-labelledby="comment-modal" aria-describedby="comment-modal-description">
                <Box sx={styles.modalBox}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                        Edit Comment
                    </Typography>
                    <TextField
                        label="Comment"
                        multiline
                        rows={4}
                        fullWidth
                        value={content}
                        onChange={handleContentChange}
                        sx={styles.input}
                        error={contentError}
                        helperText={contentError ? 'Content is required' : ''}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <Button onClick={handleCancel} variant="text" sx={buttonStyle} size="small" fullWidth>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            size="small"
                            fullWidth
                            disabled={content.trim() === ''}
                            sx={{
                                ...containedButtonStyle,
                                opacity: content.trim() === '' ? 0.6 : 1,
                                '&.Mui-disabled': {
                                    color: '#e3e3e3',
                                },
                                '&:hover': {
                                    background: 'linear-gradient(to bottom, #2a2a2a, #333)',
                                    color: '#ffffff',
                                },
                            }}
                        >
                            Update
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </ThemeProvider>
    );
};

export default UpdateCommentModal;
