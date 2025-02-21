import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {CircularProgress, Box, Typography, Grid, Avatar, Card, CardContent} from '@mui/material';
import {styled} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';
import {fetchPosts} from "../redux/actions/postActions";
import Container from "@mui/material/Container";
import LoadingDots from "../utils/LoadingDots";
import ErrorScreen from "../utils/ErrorScreen";

const API_BASE_URL = 'http://localhost:8080';

const StyledCard = styled(Card)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: '12px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: theme.spacing(3),
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'scale(1.03)',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
    },
}));

const HeaderRow = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px',
});

const AuthorInfo = styled(Box)({
    display: 'flex',
    flexDirection: 'column',
});

const HomePage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {posts, loading, error} = useSelector((state) => state.posts);
    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    if (loading) return <LoadingDots/>;
    if (error) return <ErrorScreen error={error}/>;

    const recentPosts = [...posts]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

    return (
        <Container maxWidth="md" sx={{mt: '140px'}}>
            <Box display="flex" alignItems="center" justifyContent="center" mb={6}>
                <Box
                    component="img"
                    src="/logo.png"
                    alt="QFlow Logo"
                    sx={{height: 170, width: 170}}
                />
                <Box>
                    <Typography variant="h3" fontWeight="bold">
                        Welcome to QFlow!
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        color="textSecondary"
                        sx={{fontSize: '1.03rem'}} 
                    >
                        The platform where developers ask questions and get answers.<br/>
                        Join discussions, share knowledge, and find solutions.
                    </Typography>

                </Box>
            </Box>

            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    textAlign: 'center', 
                }}
            >
                Recent Posts
            </Typography>

            <Grid container spacing={3}>
                {recentPosts.map((post) => {
                    const handleAuthorClick = () => {
                        if (post.author?.id) {
                            navigate(`/users/${post.author.id}`);
                        }
                    };
                    const handlePostClick = () => {
                        navigate(`/posts/${post.id}`);
                    };
                    return (
                        <Grid item xs={12} sm={6} md={4} key={post.id}>
                            <StyledCard
                                variant="outlined"
                                sx={{
                                    cursor: 'pointer',

                                    marginBottom: 0, 
                                }}
                            >
                                <CardContent>
                                    <HeaderRow onClick={handleAuthorClick}>
                                        <Avatar
                                            alt={post.author?.full_name || 'Anonymous'}
                                            src={`${API_BASE_URL}${post.author?.profile_picture || '/static/images/avatar/default.jpg'}`}
                                            sx={{width: 50, height: 50}}
                                        />
                                        <AuthorInfo>
                                            <Typography variant="subtitle1" sx={{fontWeight: 'bold', color: '#343a40'}}>
                                                {post.author?.full_name || 'Anonymous'}
                                            </Typography>
                                            <Typography variant="caption" sx={{color: '#868e96'}}>
                                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </Typography>
                                        </AuthorInfo>
                                    </HeaderRow>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            mt: 1,
                                            cursor: 'pointer',
                                            color: '#000',
                                        }}
                                        onClick={handlePostClick}
                                    >
                                        {post.title}
                                    </Typography>
                                </CardContent>
                            </StyledCard>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
};

export default HomePage;
