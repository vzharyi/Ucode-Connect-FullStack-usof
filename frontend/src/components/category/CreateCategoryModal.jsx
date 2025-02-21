import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { createCategory} from '../../redux/actions/categoryActions';
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

const CategoryModal = ({ open, handleClose, category, isEditMode, onSubmit }) => {
    const dispatch = useDispatch();
    const [title, setTitle] = useState(category ? category.title : '');
    const [description, setDescription] = useState(category ? category.description : '');
    const [titleError, setTitleError] = useState(false);

    useEffect(() => {
        if (category) {
            setTitle(category.title);
            setDescription(category.description);
        } else {
            setTitle('');
            setDescription('');
        }
    }, [category]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        if (e.target.value.trim() === '') {
            setTitleError(true);
        } else {
            setTitleError(false);
        }
    };

    const handleSubmit = () => {
        if (title.trim() === '') {
            setTitleError(true);
            return;
        }
        if (isEditMode) {
            onSubmit({ title, description });
        } else {
            dispatch(createCategory({ title, description }));
        }

        setTitle('');
        setDescription('');
        handleClose();
    };

    const handleCancel = () => {
        setTitle('');
        setDescription('');
        handleClose();
    };

    return (
        <ThemeProvider theme={theme}>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="category-modal"
                aria-describedby="category-modal-description"
            >
                <Box sx={styles.modalBox}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>
                        {isEditMode ? 'Update Category' : 'Create New Category'}
                    </Typography>
                    <TextField
                        label="Title"
                        value={title}
                        onChange={handleTitleChange}
                        fullWidth
                        sx={styles.input}
                        error={titleError}
                        helperText={titleError ? 'Title is required' : ''}
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        sx={styles.input}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <Button onClick={handleCancel} variant="text" sx={buttonStyle} size="small" fullWidth>Cancel</Button>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            size="small"
                            fullWidth
                            disabled={title.trim() === ''}
                            sx={{
                                ...containedButtonStyle,
                                opacity: title.trim() === '' ? 0.6 : 1,
                                '&.Mui-disabled': {
                                    color: '#e3e3e3',
                                },
                                '&:hover': {
                                    background: 'linear-gradient(to bottom, #2a2a2a, #333)',
                                    color: '#ffffff',
                                },
                            }}
                        >
                            {isEditMode ? 'Update' : 'Create'}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </ThemeProvider>
    );
};

export default CategoryModal;
