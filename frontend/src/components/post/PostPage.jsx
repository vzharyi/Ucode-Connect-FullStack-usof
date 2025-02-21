import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {createComment, fetchCommentsForPost, fetchPost} from '../../redux/actions/postActions';
import PostCard from '../post/PostCard';
import CommentList from '../comment/CommentList';
import Snackbar from "@mui/material/Snackbar";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {styled} from "@mui/material/styles";
import Container from "@mui/material/Container";

const CustomAlert = styled(Box)(({theme}) => ({
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

const PostPage = () => {
    const {post_id} = useParams();
    const dispatch = useDispatch();
    const {comments} = useSelector((state) => state.posts);
    const {currentPost} = useSelector((state) => state.posts);
    const currentUser = useSelector((state) => state.auth.user);
    const [commentContent, setCommentContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        dispatch(fetchPost(post_id));
        dispatch(fetchCommentsForPost(post_id));
    }, [dispatch, post_id]);

    const commentsForPost = comments[post_id] || [];
    const handleCommentSubmit = async () => {
        if (commentContent.trim() === '') return;
        setIsSubmitting(true);
        try {
            await dispatch(createComment(post_id, commentContent));
            setCommentContent('');
        } catch (error) {
            console.error('Failed to submit comment:', error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isCommentingAllowed = currentUser && !currentPost?.locked;

    return (
        <Container maxWidth="md" sx={{mt: '130px'}}>
            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                {currentPost ? (
                    <>
                        <PostCard post={currentPost} isClickable={false} isTruncated={false}
                                  setOpenSnackbar={setOpenSnackbar}/>
                        <Typography variant="h6" sx={{mb: 2, color: '#343a40', fontWeight: 'bold'}}>
                            Comments
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 2,
                                mt: -4,
                                pt: 2,
                                opacity: isCommentingAllowed ? 1 : 0.5, 
                            }}
                        >
                            <Box sx={{flexGrow: 1}}>
                                {!isCommentingAllowed && (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: '#ff0000', 
                                            marginBottom: '8px',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {currentUser
                                            ? 'This post is locked. You cannot add comments.'
                                            : 'Please log in to add a comment.'}
                                    </Typography>
                                )}
                                <TextField
                                    fullWidth
                                    placeholder="Add a comment..."
                                    variant="standard"
                                    value={commentContent}
                                    onChange={(e) => setCommentContent(e.target.value)}
                                    multiline
                                    disabled={!isCommentingAllowed} 
                                    InputProps={{
                                        disableUnderline: true,
                                        sx: {
                                            fontSize: '14px',
                                            color: '#111',
                                            backgroundColor: '#f9f9f9',
                                            borderRadius: '8px',
                                            padding: '8px 12px',
                                            border: '1px solid #e9ecef',
                                        },
                                    }}
                                />

                                <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 2}}>
                                    <Button
                                        variant="text"
                                        disabled={isSubmitting || commentContent.trim() === ''}
                                        color="inherit"
                                        onClick={() => setCommentContent('')}
                                        sx={{
                                            fontSize: '14px',
                                            fontWeight: 'bold',
                                            padding: '6px 12px',
                                            borderRadius: '10px',
                                            color: '#46526a',
                                            opacity: isSubmitting || commentContent.trim() === '' ? 0.6 : 1,
                                            '&.Mui-disabled': {
                                                color: '#46526a',
                                            },
                                            '&:hover': {
                                                backgroundColor: '#e9ecf2',
                                                color: '#000',
                                            },
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        disabled={isSubmitting || commentContent.trim() === ''}
                                        onClick={handleCommentSubmit}
                                        sx={{
                                            fontSize: '14px',
                                            background: 'linear-gradient(to bottom, #1a1a1a, #000)',
                                            fontWeight: 'bold',
                                            padding: '6px 12px',
                                            borderRadius: '10px',
                                            color: '#e3e3e3',
                                            opacity: isSubmitting || commentContent.trim() === '' ? 0.6 : 1,
                                            '&.Mui-disabled': {
                                                color: '#e3e3e3',
                                            },
                                            '&:hover': {
                                                background: 'linear-gradient(to bottom, #2a2a2a, #333)',
                                                color: '#ffffff',
                                            },
                                        }}
                                    >
                                        Send
                                    </Button>
                                </Box>

                            </Box>
                        </Box>
                        <CommentList comments={commentsForPost}/>
                    </>
                ) : (
                    <Box></Box>
                )}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={4000}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                    onClose={() => setOpenSnackbar(false)}
                >
                    <CustomAlert sx={{backgroundColor: '#fbebeb'}}>
                        <CheckCircleIcon sx={{marginRight: '8px', color: '#000'}}/>
                        You need to log in to like or add to favorites
                    </CustomAlert>
                </Snackbar>
            </Box>
        </Container>
    );
};

export default PostPage;
