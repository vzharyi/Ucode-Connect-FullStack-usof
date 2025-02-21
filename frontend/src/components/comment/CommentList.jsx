import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CommentCard from './CommentCard';
import Typography from '@mui/material/Typography';
import {deleteComment, updateComment} from "../../redux/actions/commentActions";
import UpdateCommentModal from "./UpdateCommentModal";
import {useDispatch} from "react-redux";
import {styled} from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Snackbar from "@mui/material/Snackbar"; 

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

const CommentList = ({ comments}) => {
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const [currentComment, setCurrentComment] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleEditClick = (comment) => {
        setCurrentComment(comment); 
        setOpenModal(true); 
    };

    const handleDeleteClick = (comment) => {
        dispatch(deleteComment(comment.id, comment.post_id));
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleUpdateComment = (updatedContent) => {
        dispatch(updateComment(currentComment.post_id, currentComment.id, updatedContent));
        setCurrentComment({ ...currentComment, content: updatedContent });
        setOpenModal(false);
    };

    if (!comments || comments.length === 0) {
        return <Typography>No comments available.</Typography>;
    }
    const topLevelComments = comments.filter(comment => comment.parent_comment_id === null);
    return (
        <Box sx={{ mt: 4 }}>
            <Grid container spacing={2}>
                {topLevelComments.map((comment) => (
                    <Grid item xs={12} key={comment.id}>
                        <CommentCard
                            comment={comment}
                            onEditClick={() => handleEditClick(comment)} 
                            onDeleteClick={handleDeleteClick}
                            setOpenSnackbar={setOpenSnackbar}
                        />
                    </Grid>
                ))}
            </Grid>

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
        </Box>
    );
};

export default CommentList;
