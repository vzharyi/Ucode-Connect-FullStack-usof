import React, {useEffect, useState} from 'react';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Typography from "@mui/material/Typography";
import {useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {fetchUserData, logout} from '../../redux/actions/authActions';
import { Modal} from "@mui/material";
import CreatePostPage from "../post/CreatePostPage";
import {fetchPosts} from "../../redux/actions/postActions";

const API_BASE_URL = 'http://localhost:8080';

const buttonStyle = {
    display: { xs: 'none', md: 'flex' },
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '6px 12px',
    borderRadius: '10px',
    color: '#46526a',
    '&:hover': {
        backgroundColor: '#e9ecf2',
        color: '#000',
    },
};

const buttonStyle1 = {
    display: { xs: 'none', md: 'flex' },
    fontSize: '14px',
    fontWeight: 'bold',
    padding: '3px 6px',
    borderRadius: '10px',
    color: '#46526a',
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


export default function AppAppBar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState(''); 
    const [filteredPosts, setFilteredPosts] = useState([]); 
    const posts = useSelector((state) => state.posts?.posts || []);
    const [openModal, setOpenModal] = useState(false);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const userRole = useSelector((state) => state.auth?.user?.role);

    useEffect(() => {
        dispatch(fetchPosts()); 
    }, [dispatch]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.length >= 2) {
            const filtered = Array.isArray(posts)
                ? posts.filter(post => post.title.toLowerCase().includes(value.toLowerCase()))
                : [];
            setFilteredPosts(filtered); 
        } else {
            setFilteredPosts([]); 
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        window.location.replace('/posts');
    };

    const handleProfileClick = () => {
        navigate('/profile'); 
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchUserData()); 
        }
    }, [dispatch, isAuthenticated]);

    return (
        <AppBar
            position="fixed"
            sx={{
                boxShadow: 0,
                bgcolor: 'transparent',
                backgroundImage: 'none',
                borderRadius: '16px',
                mt: '15px',
            }}>
            <Container maxWidth="lg">
                <Toolbar
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backdropFilter: 'blur(24px)',
                        borderRadius: '16px',
                        border: '1px solid rgba(0,0,0,0.12)',
                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                        boxShadow: 1,
                    }}>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box
                            onClick={() => navigate('/')}
                            sx={{display: 'flex', alignItems: 'center', cursor: 'pointer'}}>
                            <img
                                src="/logo.png"
                                alt="USOF Logo"
                                style={{ height: '40px', objectFit: 'contain' }}/>
                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'black',
                                }}>
                                QFlow
                            </Typography>
                        </Box>
                        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                            <Button
                                variant="text"
                                sx={buttonStyle}
                                size="small"
                                onClick={() => navigate('/posts')}
                            >
                                Posts
                            </Button>
                            <Button
                                variant="text"
                                sx={buttonStyle}
                                size="small"
                                onClick={() => navigate('/categories')}
                            >
                                Categories
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ flexGrow: 1, mx: 2 }}>
                        <FormControl sx={{ width: '100%' }} variant="outlined">
                            <OutlinedInput
                                size="small"
                                id="search"
                                placeholder="Search…"
                                autoComplete="off"
                                sx={{
                                    height: '40px',
                                    borderRadius: '10px',
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#000',
                                    },
                                }}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                startAdornment={
                                    <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                                        <SearchRoundedIcon fontSize="small" />
                                    </InputAdornment>
                                }
                                inputProps={{
                                    'aria-label': 'search',
                                }}
                            />
                            {filteredPosts.length > 0 && (
                                <Box sx={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    bgcolor: 'white',
                                    boxShadow: 1,
                                    zIndex: 10,
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                    borderRadius: '4px',
                                    mt: 1,
                                }}>
                                    {filteredPosts.map((post) => (
                                        <Box
                                            key={post.id}
                                            sx={{
                                                padding: '8px',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    backgroundColor: '#f0f0f0',
                                                },
                                            }}
                                            onClick={() => window.location.href = `/posts/${post.id}`} 
                                        >
                                            <Typography variant="body2" sx={{ color: 'black' }}>
                                                {post.title}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </FormControl>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',            
                            gap: 1,
                            alignItems: 'center',
                            justifyContent: 'flex-end', 
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {isAuthenticated ? (
                            <>
                            {userRole === 'admin' && (
                                <>
                                    <Box sx={{ display: 'flex', flexDirection: 'column'}}>
                                        <Button
                                            variant="text"
                                            sx={{...buttonStyle1, fontSize: '13px'}}
                                            size="small"
                                            onClick={() => navigate('/users')}
                                        >
                                            Users
                                        </Button>
                                        <Button
                                            variant="text"
                                            sx={{...buttonStyle1, fontSize: '13px'}}
                                            size="small"
                                            onClick={() => window.open('http://localhost:8080/admin', '_blank')}

                                        >
                                            Admin Panel
                                        </Button>
                                    </Box>
                                </>
                                )}
                                <Button
                                    variant="text"
                                    sx={buttonStyle}
                                    size="small"
                                    onClick={() => navigate('/favorites')}
                                >
                                    Favorites
                                </Button>
                                <Button
                                    variant="text"
                                    sx={buttonStyle}
                                    size="small"
                                    onClick={handleOpenModal}
                                >
                                    Add post
                                </Button>
                                <Modal open={openModal} onClose={handleCloseModal}>
                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            boxShadow: 24,
                                            borderRadius: 2,
                                        }}
                                    >
                                        <CreatePostPage onClose={handleCloseModal} />
                                    </Box>
                                </Modal>
                                <Box
                                    sx={{
                                        display: { xs: 'none', md: 'flex' },
                                        alignItems: 'center',
                                        gap: 1,
                                        cursor: 'pointer',
                                    }}
                                    onClick={handleProfileClick}
                                >
                                    <img
                                        src={`${API_BASE_URL}${user?.profile_picture || '/static/images/avatar/default.jpg'}`}
                                        alt="User Avatar"
                                        style={{
                                            width: '45px',
                                            height: '45px',
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <Typography
                                            sx={{
                                                fontSize: '13px',
                                                color: 'black',
                                                textTransform: 'uppercase',
                                                fontWeight: 'bold',
                                                border: '1px solid black',
                                                borderRadius: '10px',
                                                padding: '2px 4px',
                                                lineHeight: '1.1', 
                                            }}
                                        >
                                            {userRole}
                                        </Typography>
                                        <Typography sx={{ fontSize: '16px', color: 'black', whiteSpace: 'nowrap', lineHeight: '1.1' }}>
                                            {user?.full_name}
                                        </Typography>
                                    </Box>

                                </Box>

                                <Box
                                    variant="text"
                                    size="small"
                                    onClick={handleLogout}
                                    sx={{
                                        padding: 0,
                                        minWidth: 'auto',
                                        minHeight: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <img
                                        src={`${API_BASE_URL}/uploads/image/logout.png`}
                                        alt="Logout"
                                        style={{ width: '35px', height: '35px' }}
                                    />
                                </Box>
                            </>
                        ) : (
                            <>
                                <Button
                                    variant="text"
                                    sx={buttonStyle}
                                    size="small"
                                    onClick={() => navigate('/login')}
                                >
                                    Sign in
                                </Button>
                                <Button
                                    variant="contained"
                                    sx={containedButtonStyle}
                                    size="small"
                                    onClick={() => navigate('/register')}
                                >
                                    Sign up
                                </Button>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
