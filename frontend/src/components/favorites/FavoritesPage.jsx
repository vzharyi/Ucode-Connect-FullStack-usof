import React, { useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid } from '@mui/material';
import PostCard from '../post/PostCard'; 
import LoadingDots from "../../utils/LoadingDots"; 
import ErrorScreen from "../../utils/ErrorScreen"; 
import { useNavigate} from 'react-router-dom';
import { fetchFavorites } from "../../redux/actions/postActions";
import Container from "@mui/material/Container"; 

const FavoritesPage = () => {
    const dispatch = useDispatch();
    const { favorites, loading, error } = useSelector((state) => state.favorites || {}); 
    const navigate = useNavigate();

    useEffect(() => {
            dispatch(fetchFavorites());  
    }, [dispatch]); 

    const handleCardClick = (postId) => {
        navigate(`/posts/${postId}`);
    };

    if (loading) return <LoadingDots />;
    if (error) return <ErrorScreen message={error} />;

    return (
        <Container maxWidth="md" sx={{mt: '130px'}}>
            <Box sx={{ mt: 4 }}>
                {favorites.length > 0 ? (
                    <Grid container spacing={2} columns={12}>
                        {favorites.map((favorite) => (
                            <Grid item xs={12} md={12} key={favorite.posts.id}>
                                <PostCard
                                    post={favorite.posts}
                                    categories={favorite.posts?.categories || []}
                                    onCardClick={() => handleCardClick(favorite.posts.id)}
                                    isClickable
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box>No favorite posts found.</Box>
                )}
            </Box>
        </Container>
    );
};

export default FavoritesPage;
