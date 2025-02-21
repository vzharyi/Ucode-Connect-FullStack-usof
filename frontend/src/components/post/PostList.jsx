import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import PostCard from './PostCard';
import { useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { keyframes } from '@mui/material';
import Snackbar from "@mui/material/Snackbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {styled} from "@mui/material/styles";

const bounceAnimation = keyframes`
    0%, 80%, 100% {
        transform: scale(0);
    }
    40% {
        transform: scale(1);
    }
`;

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

export default function PostList({ posts }) {
    const navigate = useNavigate();
    const [visiblePosts, setVisiblePosts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(5);
    const [loading, setLoading] = useState(false);
    const postsPerPage = 5;
    useEffect(() => {
        setVisiblePosts(posts.slice(0, 5));
    }, [posts]);

    const loadMorePosts = () => {
        if (loading) return;
        setLoading(true);
        const nextIndex = currentIndex + postsPerPage;

        setTimeout(() => {
            setVisiblePosts(posts.slice(0, nextIndex));
            setCurrentIndex(nextIndex);
            setLoading(false);
        }, 1000);
    };

    const handleCardClick = (post_id) => {
        navigate(`/posts/${post_id}`);
    };
    const [openSnackbar, setOpenSnackbar] = useState(false);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4,  }}>
            <InfiniteScroll
                dataLength={visiblePosts.length}
                next={loadMorePosts}
                hasMore={visiblePosts.length < posts.length}
                loader={
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: '-5px',
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
                }
                scrollThreshold={0.9}
            >
                <Grid container spacing={1} columns={12}>
                    {visiblePosts.map((post) => (
                        <Grid item xs={12} md={12} key={post.id}>
                            <PostCard post={post} onCardClick={handleCardClick} isClickable={true} isTruncated={true}
                                      setOpenSnackbar={setOpenSnackbar}/>
                        </Grid>
                    ))}
                </Grid>
            </InfiniteScroll>
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

        </Box>
    );
}
