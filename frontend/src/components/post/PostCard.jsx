import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import {Modal, Tooltip} from "@mui/material";
import {styled} from '@mui/material/styles';
import {useNavigate} from "react-router-dom";
import LoadingDots from "../../utils/LoadingDots";
import ErrorScreen from "../../utils/ErrorScreen";
import {
    addFavorite,
    deleteLike,
    deletePost,
    fetchCommentsForPost,
    likePost,
    removeFavorite
} from "../../redux/actions/postActions";
import UpdatePostModal from "./UpdatePostModal";
import {useLocation} from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080';

const StyledCard = styled(({isClickable, ...rest}) => <Card {...rest} />)(({theme, isClickable}) => ({
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: '12px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: theme.spacing(2),
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
    transform: 'scale(0.97)',
    
    '&:hover': isClickable && {
        backgroundColor: '#f8f9fa', 
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)', 
        transform: 'scale(0.99)',
    },
    
    ...(isClickable === false && {
        backgroundColor: '#f8f9fa', 
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)', 
        transform: 'scale(1.02)', 
    }),
}));

const StyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    padding: '16px',
    gap: '12px',
});

const AuthorInfo = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
});

const CategoryButton = styled(Button)({
    fontSize: '11px',
    background: 'linear-gradient(to bottom, #1a1a1a, #000)',
    fontWeight: 'bold',
    padding: '2px 8px',
    borderRadius: '10px',
    color: '#e3e3e3',
    textTransform: 'none',
    '&:hover': {
        background: 'linear-gradient(to bottom, #2a2a2a, #333)',
        color: '#ffffff',
    },
});

const PostCard = ({post, onCardClick, isClickable = false, isTruncated = true, openSnackbar, setOpenSnackbar}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userRole = useSelector((state) => state.auth?.user?.role);
    const {currentPost} = useSelector((state) => state.posts);
    const {comments, loading, error} = useSelector((state) => state.posts); 
    const commentsForPost = comments[post.id] || [];
    const isOnPostPage = location.pathname.includes(`/posts/${post.id}`);
    const truncatedDescription = isTruncated ? post.content?.slice(0, 200) : post.content;
    const isDescriptionLong = post.content && post.content.length > 200;

    useEffect(() => {
        if (!commentsForPost.length) {
            dispatch(fetchCommentsForPost(post.id));
        }
    }, [dispatch, post.id, commentsForPost.length]);

    const commentsCount = commentsForPost.length;

    const handleCategoryClick = (category_id) => {
        navigate(`/categories/${category_id}`);
    };

    const handleAuthorClick = () => {
        if (post.author?.id) {
            navigate(`/users/${post.author.id}`);
        }
    };
    const currentUserId = useSelector((state) => state.auth.user?.id);
    const [localLikeType, setLocalLikeType] = useState(null);

    useEffect(() => {
        
        const userLike = post.likes?.find((like) => like.author_id === currentUserId);
        setLocalLikeType(userLike?.type || null);
    }, [post.likes, currentUserId]);

    const handleLike = () => {
        if (!currentUserId) {
            setOpenSnackbar(true); 
            return;
        }
        if (localLikeType === 'like') {
            dispatch(deleteLike(post.id)).then(() => {
                setLocalLikeType(null);
            });
        } else {
            dispatch(likePost(post.id, 'like')).then(() => {
                setLocalLikeType('like');
            });
        }
    };

    const handleDislike = () => {
        if (!currentUserId) {
            setOpenSnackbar(true); 
            return;
        }
        if (localLikeType === 'dislike') {
            dispatch(deleteLike(post.id)).then(() => {
                setLocalLikeType(null);
            });
        } else {
            dispatch(likePost(post.id, 'dislike')).then(() => {
                setLocalLikeType('dislike');
            });
        }
    };

    const favoritesKey = `favorites_user_${currentUserId}`;
    const savedFavorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
    const [isFavorite, setIsFavorite] = useState(savedFavorites.includes(post.id));

    useEffect(() => {
        if (!currentUserId) return;
        const currentFavorites = JSON.parse(localStorage.getItem(favoritesKey)) || [];
        if (isFavorite && !currentFavorites.includes(post.id)) {
            localStorage.setItem(favoritesKey, JSON.stringify([...currentFavorites, post.id]));
        } else if (!isFavorite && currentFavorites.includes(post.id)) {
            const updatedFavorites = currentFavorites.filter(id => id !== post.id);
            localStorage.setItem(favoritesKey, JSON.stringify(updatedFavorites));
        }
    }, [isFavorite, post.id, favoritesKey]);

    const handleFavoriteToggle = useCallback(() => {
        if (!currentUserId) {
            setOpenSnackbar(true); 
            return;
        }
        const updatedFavoriteStatus = !isFavorite;
        setIsFavorite(updatedFavoriteStatus);
        if (updatedFavoriteStatus) {
            dispatch(addFavorite(post.id)); 
        } else {
            dispatch(removeFavorite(post.id)); 
        }
    }, [isFavorite, dispatch, post.id, currentUserId]);

    const [selectedPost, setSelectedPost] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    
    const handleOpenModal = (postId, postData) => {
        setSelectedPost(postData);  
        setOpenModal(true);
    };

    
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDelete = () => {

        dispatch(deletePost(post.id))  
            .then(() => {
                
                navigate(`/posts`);  
            })
            .catch((error) => {
                
                console.error('Error deleting post:', error);
            });

    };

    if (loading) return <LoadingDots/>;
    if (error) return <ErrorScreen error={error}/>;

    return (
        <StyledCard isClickable={isClickable}>
            <StyledCardContent>
                <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <AuthorInfo>
                        <Avatar
                            alt={post.author?.full_name || 'Anonymous'}
                            src={`${API_BASE_URL}${post.author?.profile_picture || '/static/images/avatar/default.jpg'}`}
                            sx={{width: 40, height: 40, cursor: 'pointer',}}
                            onClick={handleAuthorClick}
                        />
                        <Box>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                <Typography
                                    variant="subtitle1" sx={{fontWeight: 'bold', color: '#343a40', cursor: 'pointer',}}
                                    onClick={handleAuthorClick}
                                >
                                    {post.author?.full_name || 'Anonymous'}
                                </Typography>
                                <Box sx={{display: 'flex', gap: 1}}>
                                    {(post.categories || []).map((category) => (
                                        <CategoryButton
                                            key={category.PostCategories?.category_id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (category.PostCategories?.category_id) {
                                                    handleCategoryClick(category.PostCategories.category_id);
                                                }
                                            }}
                                        >
                                            {category.title}
                                        </CategoryButton>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </AuthorInfo>
                    <Typography
                        variant="caption"
                        sx={{
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize: '16px',
                        }}
                    >
                        <Box sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}>
                            {(userRole === 'admin' || post.author_id === currentUserId) && isOnPostPage && (
                                <>
                                    {!currentPost?.locked && (
                                        <Tooltip title="Update post" arrow>
                                            <Box
                                                component="img"
                                                alt="Update"
                                                src={`${API_BASE_URL}/uploads/image/update-post.png`}
                                                sx={{
                                                    width: 25,
                                                    height: 25,
                                                    cursor: 'pointer',
                                                }}
                                                onClick={() => handleOpenModal(post.id, post)}
                                            />
                                        </Tooltip>
                                    )}
                                    <Tooltip title="Delete post" arrow>
                                        <Box
                                            component="img"
                                            alt="Delete"
                                            src={`${API_BASE_URL}/uploads/image/delete.png`}
                                            sx={{
                                                width: 28,
                                                height: 28,
                                                cursor: 'pointer',
                                            }}
                                            onClick={handleDelete}
                                        />
                                    </Tooltip>

                                </>
                            )}

                            {post.locked && (
                                <Tooltip title="Post locked" arrow>
                                    <Box
                                        component="img"
                                        alt="Locked"
                                        src={`${API_BASE_URL}/uploads/image/locked1.png`}
                                        sx={{
                                            width: 25,
                                            height: 25,
                                            cursor: 'pointer',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </Tooltip>
                            )}

                            <Tooltip title="Post rating" arrow>
                                <Box
                                    component="img"
                                    alt="Rating"
                                    src={`${API_BASE_URL}/uploads/image/rating.png`}
                                    sx={{
                                        width: 25,
                                        height: 25,
                                        cursor: 'pointer',
                                        objectFit: 'contain',
                                        marginBottom: '2px',
                                    }}
                                />
                            </Tooltip>
                            {post.rating || 0}
                            <Tooltip title="Favorites" arrow>
                                <Box
                                    component="img"
                                    alt="Favorites"
                                    src={`${API_BASE_URL}/uploads/image/${
                                        isFavorite ? 'favorites2.png' : 'favorites1.png'
                                    }`}
                                    sx={{
                                        width: 25,
                                        height: 25,
                                        cursor: 'pointer',
                                        '&:hover': {
                                            content: `url(${API_BASE_URL}/uploads/image/favorites2.png)`
                                        },
                                    }}
                                    onClick={handleFavoriteToggle}
                                />
                            </Tooltip>

                            <Modal open={openModal}>
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
                                    <UpdatePostModal
                                        post={post}
                                        postId={selectedPost ? selectedPost.id : null}
                                        initialData={selectedPost || {}}
                                        onClose={handleCloseModal}
                                    />
                                </Box>
                            </Modal>
                        </Box>
                    </Typography>
                </Box>

                <Box
                    sx={{
                        cursor: isClickable ? 'pointer' : 'default',
                        '&:hover': isClickable ? {opacity: 0.9} : {},
                    }}
                    onClick={() => isClickable && onCardClick && onCardClick(post.id)}
                >
                    <Typography variant="h6" sx={{fontWeight: 'bold', marginBottom: '5px'}}>
                        {post.title}
                    </Typography>
                    <Typography variant="body2" sx={{color: '#495057', fontSize: '15px'}}>
                        {truncatedDescription}{isTruncated && isDescriptionLong && '...'}
                    </Typography>
                </Box>

                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px'}}>
                    <Box sx={{display: 'flex', gap: 1}}>
                        <Box
                            component="img"
                            alt="Like"
                            src={`${API_BASE_URL}/uploads/image/${
                                localLikeType === 'like' ? 'filled-like.png' : 'unfilled-like.png'
                            }`}
                            sx={{
                                width: 24,
                                height: 24,
                                cursor: 'pointer',
                                '&:hover': {
                                    content: `url(${API_BASE_URL}/uploads/image/filled-like.png)`,
                                },
                            }}
                            onClick={handleLike}
                        />
                        <Box
                            component="img"
                            alt="Dislike"
                            src={`${API_BASE_URL}/uploads/image/${
                                localLikeType === 'dislike' ? 'filled-dislike.png' : 'unfilled-dislike.png'
                            }`}
                            sx={{
                                width: 24,
                                height: 24,
                                cursor: 'pointer',
                                '&:hover': {
                                    content: `url(${API_BASE_URL}/uploads/image/filled-dislike.png)`,
                                },
                            }}
                            onClick={handleDislike}
                        />
                        {/* Количество комментариев */}
                        <Typography variant="body2" sx={{marginLeft: 1, color: '#868e96'}}>
                            {commentsCount} comments
                        </Typography>
                    </Box>
                    <Typography variant="caption" sx={{color: '#868e96'}}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </Typography>
                </Box>
            </StyledCardContent>
        </StyledCard>
    );
};

export default PostCard;

