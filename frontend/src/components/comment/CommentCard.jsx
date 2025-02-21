import React, { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import {
    createReply,
    deleteComment,
    deleteLikeForComment,
    likeComment,
    updateComment
} from '../../redux/actions/commentActions';
import {useParams} from "react-router-dom";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import UpdateCommentModal from "./UpdateCommentModal";
import {Tooltip} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Snackbar from "@mui/material/Snackbar";

const API_BASE_URL = 'http://localhost:8080';

const StyledCard = styled(Card)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    backgroundColor: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: '12px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: theme.spacing(2),
}));

const StyledCardContent = styled(CardContent)({
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 16,
});

const AuthorInfo = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    marginBottom: '8px',
});

const buttonStyle = {
    fontSize: '13px',
    fontWeight: 'bold',
    padding: '2px 4px',
    borderRadius: '10px',
    color: '#46526a',
    border: '1px solid black',
    '&:hover': {
        backgroundColor: '#e9ecf2',
        color: '#000',
        border: '1px solid #000',
    },
};

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

const CommentCard = ({ comment, postId, onEditClick, onDeleteClick}) => {
    const userRole = useSelector((state) => state.auth?.user?.role);
    const currentUserId = useSelector((state) => state.auth.user?.id);
    const { currentPost } = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const [localLikeType, setLocalLikeType] = useState(null);
    const {post_id} = useParams();
    const comments = useSelector((state) => state.posts.comments[post_id] || []);
    const [replyContent, setReplyContent] = useState('');
    const [showReplies, setShowReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const savedLikeType = localStorage.getItem(`comment-${comment.id}-user-${currentUserId}-like`);
        if (savedLikeType) {
            setLocalLikeType(savedLikeType);
        } else {
            const userLike = comment.likes?.find((like) => like.author_id === currentUserId);
            setLocalLikeType(userLike?.type || null);
        }
    }, [comment.likes, currentUserId, comment.id]);

    const handleLike = () => {
        if (!currentUserId) {
            setOpenSnackbar(true);
            return;
        }
        if (localLikeType === 'like') {
            dispatch(deleteLikeForComment(comment.post_id, comment.id)).then(() => {
                setLocalLikeType(null);
                localStorage.removeItem(`comment-${comment.id}-user-${currentUserId}-like`);
            });
        } else {
            dispatch(likeComment(comment.post_id, comment.id, 'like')).then(() => {
                setLocalLikeType('like');
                localStorage.setItem(`comment-${comment.id}-user-${currentUserId}-like`, 'like');
            });
        }
    };

    const handleDislike = () => {
        if (!currentUserId) {
            setOpenSnackbar(true);
            return;
        }
        if (localLikeType === 'dislike') {
            dispatch(deleteLikeForComment(comment.post_id, comment.id)).then(() => {
                setLocalLikeType(null);
                localStorage.removeItem(`comment-${comment.id}-user-${currentUserId}-like`);
            });
        } else {
            dispatch(likeComment(comment.post_id, comment.id, 'dislike')).then(() => {
                setLocalLikeType('dislike');
                localStorage.setItem(`comment-${comment.id}-user-${currentUserId}-like`, 'dislike');
            });
        }
    };

    const handleReplyChange = (e) => {
        setReplyContent(e.target.value);
    };

    const handleReplySubmit = async () => {
        if (!replyContent.trim()) return;
        await dispatch(createReply(post_id, comment.id, replyContent));
        setReplyContent('');
        setIsReplying(false);
    };

    const handleShowReplies = () => {
        setShowReplies(!showReplies);
    };

    const handleDeleteClick = (comment) => {
        dispatch(deleteComment(comment.id, comment.post_id));
    };

    const handleEditClick = (comment) => {
        let commentToEdit = comments.find((c) => c.parent_comment_id === comment.id);
        setCurrentComment(commentToEdit);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleUpdateComment = (updatedContent) => {
        dispatch(updateComment(currentComment.post_id, currentComment.id, updatedContent));
        setCurrentComment({ ...currentComment, content: updatedContent });
        setOpenModal(false);
    };

    const replies = comments.filter((reply) => reply.parent_comment_id === comment.id);

    return (
        <StyledCard variant="outlined">
            <StyledCardContent>
                {/* Автор комментария и кнопки для редактирования и удаления */}
                <AuthorInfo>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Avatar
                            alt={comment.author?.full_name || 'Anonymous'}
                            src={`${API_BASE_URL}${comment.author?.profile_picture || '/static/images/avatar/default.jpg'}`}
                            sx={{ width: 35, height: 35 }}
                        />
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#343a40' }}>
                                {comment.author?.full_name || 'Anonymous'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#868e96' }}>
                                {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {comment.author_id === currentUserId && !currentPost?.locked && (
                            <Tooltip title="Update comment" arrow>
                                <Box
                                    component="img"
                                    alt="Update"
                                    src={`${API_BASE_URL}/uploads/image/update-post.png`}
                                    sx={{ width: 25, height: 25, cursor: 'pointer' }}
                                    onClick={() => onEditClick(comment)}
                                />
                            </Tooltip>
                        )}

                        {(userRole === 'admin' || comment.author_id === currentUserId && !currentPost?.locked) && (
                            <Tooltip title="Delete comment" arrow>
                                <Box
                                    component="img"
                                    alt="Delete"
                                    src={`${API_BASE_URL}/uploads/image/delete.png`}
                                    sx={{ width: 28, height: 28, cursor: 'pointer' }}
                                    onClick={() => onDeleteClick(comment)}
                                />
                            </Tooltip>
                        )}
                        <Box
                            sx={{
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '16px',
                                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                            }}
                        >
                            <Tooltip title="Comment rating" arrow>
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
                            {comment.rating || 0}
                        </Box>
                    </Box>
                </AuthorInfo>

                <Typography variant="body2" sx={{ color: '#495057', fontSize: '15px' }}>
                    {comment.content || 'Комментарий отсутствует'}
                </Typography>

                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, marginTop: 2}}>
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
                    <Box
                        component="img"
                        alt="Reply"
                        src={`${API_BASE_URL}/uploads/image/reply.png`}
                        sx={{
                            width: 30,
                            height: 30,
                            cursor: !currentPost?.locked ? 'pointer' : 'default',
                            opacity: !currentPost?.locked ? 1 : 0.5,
                        }}
                        onClick={() => {
                            if (!currentUserId) {
                                setOpenSnackbar(true);
                                return;
                            }
                            if (!currentPost?.locked) {
                                setIsReplying(true);
                            }
                        }}
                    />

                    {replies.length > 0 && (
                        <Button
                            onClick={handleShowReplies}
                            variant="text"
                            sx={buttonStyle}
                            size="small"
                        >
                            {showReplies
                                ? `${replies.length === 1 ? 'Hide answer' : 'Hide answers'}`
                                : `${replies.length} ${replies.length === 1 ? 'answer' : 'answers'}`}
                        </Button>
                    )}

                </Box>

                {isReplying && (
                    <Box sx={{ flexGrow: 1 }}>
                        <TextField
                            fullWidth
                            placeholder="Add a comment..."
                            variant="standard"
                            value={replyContent}
                            onChange={handleReplyChange}
                            multiline
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
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, gap: 2 }}>
                            <Button
                                variant="text"
                                color="inherit"
                                onClick={() => {
                                    setIsReplying(false);
                                    setReplyContent('');
                                }}
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 'bold',
                                    padding: '6px 12px',
                                    borderRadius: '10px',
                                    color: '#46526a',
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
                                disabled={replyContent.trim() === ''}
                                onClick={handleReplySubmit}
                                sx={{
                                    fontSize: '14px',
                                    background: 'linear-gradient(to bottom, #1a1a1a, #000)',
                                    fontWeight: 'bold',
                                    padding: '6px 12px',
                                    borderRadius: '10px',
                                    color: '#e3e3e3',
                                    opacity: replyContent.trim() === '' ? 0.6 : 1,
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
                )}
                {showReplies && (
                    <Box sx={{ marginTop: 2, paddingLeft: 2 }}>
                        {replies.map((reply) => (
                            <CommentCard
                                key={reply.id}
                                comment={reply}
                                postId={postId}
                                onDeleteClick={handleDeleteClick}
                                onEditClick={() => handleEditClick(comment)}
                            />
                        ))}
                    </Box>
                )}
            </StyledCardContent>
            <UpdateCommentModal
                open={openModal}
                handleClose={handleCloseModal}
                comment={currentComment}
                onSubmit={handleUpdateComment}
            />
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={() => setOpenSnackbar(false)}
            >
                <CustomAlert sx={{ backgroundColor: '#fbebeb' }}>
                    <CheckCircleIcon sx={{ marginRight: '8px', color: '#000' }} />
                    You need to log in to like, add to favorites, or leave a comment
                </CustomAlert>
            </Snackbar>
        </StyledCard>
    );
};

export default CommentCard;
