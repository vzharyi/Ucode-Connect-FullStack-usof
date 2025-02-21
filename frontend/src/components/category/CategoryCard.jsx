import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteCategory } from '../../redux/actions/categoryActions';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import Box from "@mui/material/Box";
import { useLocation } from 'react-router-dom';
import { Tooltip } from "@mui/material";

const API_BASE_URL = 'http://localhost:8080';

const StyledCard = styled(({ isClickable, ...rest }) => <Card {...rest} />)(({ theme, isClickable }) => ({
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
    backgroundColor: '#ffffff',
    border: '1px solid #e9ecef',
    borderRadius: '12px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
    marginBottom: theme.spacing(2),
    transition: 'background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
    '&:hover': {
        backgroundColor: '#f8f9fa',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.15)',
        transform: 'scale(1.02)',
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
    gap: 4,
    padding: 16,
});

const TitleBox = styled(Box)(({ isClickable }) => ({
    cursor: isClickable ? 'pointer' : 'default',
}));

const CategoryCard = ({ category, onCardClick, isClickable = false, onEditClick, isTruncated = true }) => {
    const userRole = useSelector((state) => state.auth?.user?.role);
    const dispatch = useDispatch();
    const location = useLocation();
    const truncatedDescription = isTruncated ? category.description?.slice(0, 50) : category.description;
    const isDescriptionLong = category.description && category.description.length > 50;
    const handleDeleteClick = () => {
        dispatch(deleteCategory(category.id));
    };

    return (
        <StyledCard isClickable={isClickable}>
            <StyledCardContent>
                <TitleBox
                    isClickable={isClickable}
                    onClick={() => isClickable && onCardClick && onCardClick(category.id)}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 'bold',
                            color: '#343a40',
                            marginBottom: '8px',
                        }}
                    >
                        {category.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#495057',
                            marginBottom: '10px',
                        }}
                    >
                        {truncatedDescription}{isTruncated && isDescriptionLong && '...'}
                    </Typography>
                </TitleBox>

                {userRole === 'admin' && location.pathname === `/categories` && (
                    <Box sx={{ display: 'flex' }}>
                        <Tooltip title="Update category" arrow>
                            <Box
                                component="img"
                                alt="Update"
                                src={`${API_BASE_URL}/uploads/image/update-post.png`}
                                sx={{
                                    width: 25,
                                    height: 25,
                                    cursor: 'pointer',
                                }}
                                onClick={() => onEditClick(category.id)}
                            />
                        </Tooltip>
                        <Tooltip title="Delete category" arrow>
                            <Box
                                component="img"
                                alt="Delete"
                                src={`${API_BASE_URL}/uploads/image/delete.png`}
                                sx={{
                                    width: 28,
                                    height: 28,
                                    cursor: 'pointer',
                                }}
                                onClick={handleDeleteClick}
                            />
                        </Tooltip>
                    </Box>
                )}
            </StyledCardContent>
        </StyledCard>
    );
};

export default CategoryCard;
