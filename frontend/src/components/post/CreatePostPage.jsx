import React, {useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import {useDispatch, useSelector} from 'react-redux';
import {createPost} from '../../redux/actions/postActions';
import {fetchCategories} from '../../redux/actions/categoryActions';
import {createTheme, ThemeProvider} from "@mui/material/styles";

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

const CreatePostModal = ({onClose}) => {
    const [formData, setFormData] = useState({title: '', content: '', categories: []});
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useDispatch();
    const {categories, loading} = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleCategorySelect = (categoryId) => {
        setFormData((prev) => ({
            ...prev,
            categories: prev.categories.includes(categoryId)
                ? prev.categories.filter((id) => id !== categoryId) 
                : [...prev.categories, categoryId], 
        }));
    };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.content) {
            setError('Title and content are required!');
            return;
        }
        setError(null);
        setIsSubmitting(true);
        try {
            const newPost = await dispatch(createPost(formData));
            setFormData({title: '', content: '', categories: []});
            onClose();
        } catch (err) {
            console.error(err); 
            setError(err.response?.data?.error || 'Failed to create post.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    p: 4,
                    width: '600px',
                    mx: 'auto',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    alignItems: 'center',
                }}
            >

                <Typography variant="h5" sx={{fontWeight: 'bold', textAlign: 'center'}}>
                    Create Post
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleSubmit} style={{width: '100%'}}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        sx={{mb: 2}}
                    />
                    <TextField
                        fullWidth
                        label="Content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        multiline
                        rows={4}
                        sx={{mb: 3}}
                    />

                    <Typography variant="subtitle1" sx={{fontWeight: 'bold'}}>
                        Categories
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 1,
                            mb: 3,
                        }}
                    >
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={formData.categories.includes(category.id) ? 'contained' : 'outlined'}
                                color={formData.categories.includes(category.id) ? 'default' : 'inherit'}
                                onClick={() => handleCategorySelect(category.id)}
                                sx={{
                                    textTransform: 'none',
                                    borderRadius: '10px',
                                    padding: '2px 8px',
                                    fontWeight: 'bold',
                                    fontSize: '11px',
                                    bgcolor: formData.categories.includes(category.id) ? '#000' : 'transparent',
                                    color: formData.categories.includes(category.id) ? '#fff' : '#333',
                                    '&:hover': {
                                        bgcolor: formData.categories.includes(category.id) ? '#333' : '#e9e9e9', 
                                        color: formData.categories.includes(category.id) ? '#fff' : '#000', 
                                    },
                                }}
                            >
                                {category.title}
                            </Button>
                        ))}

                    </Box>

                    <Box sx={{display: 'flex', gap: 2}}>
                        <Button variant="text" onClick={onClose} sx={{...buttonStyle, flexGrow: 1}}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={isSubmitting || loading}
                            sx={{...containedButtonStyle, flexGrow: 1}}
                        >
                            {isSubmitting ? 'Submitting...' : 'Create'}
                        </Button>
                    </Box>
                </form>
            </Box>
        </ThemeProvider>
    );
};

export default CreatePostModal;
