import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {fetchCategory, fetchCategoryPosts} from '../../redux/actions/categoryActions';
import CategoryCard from './CategoryCard';
import PostCard from '../post/PostCard';
import LoadingDots from "../../utils/LoadingDots";
import {styled} from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Snackbar from "@mui/material/Snackbar";
import Container from "@mui/material/Container"; 

const CustomAlert = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#fbebeb',
    color: '#000',
    borderRadius: '8px',
    padding: '8px 16px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    fontWeight: 'bold',
    fontSize: '14px',
    fontFamily: theme.typography.fontFamily,
}));

const CategoryPage = () => {
    const {category_id} = useParams();
    const dispatch = useDispatch();
    const {currentCategory, categoryPosts, loading, error} = useSelector((state) => state.categories);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    useEffect(() => {
        dispatch(fetchCategory(category_id)); 
        dispatch(fetchCategoryPosts(category_id)); 
    }, [dispatch, category_id]);

    const navigate = useNavigate();

    const handleCardClick = (post_id) => {
        navigate(`/posts/${post_id}`);
    };
    if (loading) return <LoadingDots />;

    return (
        <Container maxWidth="md" sx={{mt: '130px'}}>
            {/* Информация о категории */}
            <Box sx={{textAlign: 'center'}}>
                {currentCategory ? (
                    <CategoryCard category={currentCategory} isClickable={false} isTruncated={false}/>
                ) : (
                    <Box>No category found.</Box>
                )}
            </Box>
            <Box sx={{mt: 4}}>
                {categoryPosts.length > 0 ? (
                    <Grid container spacing={2} columns={12}>
                        {categoryPosts.map((post) => (
                            <Grid item xs={12} md={12} key={post.id}>
                                <PostCard post={post} onCardClick={handleCardClick} isClickable
                                          setOpenSnackbar={setOpenSnackbar}/>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box>No posts found for this category.</Box>
                )}
            </Box>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={() => setOpenSnackbar(false)}
            >
                <CustomAlert sx={{ backgroundColor: '#fbebeb' }}>
                    <CheckCircleIcon sx={{ marginRight: '8px', color: '#000' }} />
                    You need to log in to like or add to favorites
                </CustomAlert>
            </Snackbar>
        </Container>
    );
};

export default CategoryPage;
