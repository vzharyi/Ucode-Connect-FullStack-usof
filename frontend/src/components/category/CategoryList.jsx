import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import CategoryCard from './CategoryCard';
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories, updateCategory } from "../../redux/actions/categoryActions";
import LoadingDots from "../../utils/LoadingDots";
import ErrorScreen from "../../utils/ErrorScreen";
import CreateCategoryModal from './CreateCategoryModal';
import Container from "@mui/material/Container"; 

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
    display: 'block',
    margin: '0 auto',
    marginBottom: '20px',
    mt: '-20px',
};

export default function CategoryList() {
    const dispatch = useDispatch();
    const { categories: categoryList, loading, error } = useSelector((state) => state.categories);
    const [openModal, setOpenModal] = useState(false);
    const userRole = useSelector((state) => state.auth?.user?.role);
    const [currentCategoryId, setCurrentCategoryId] = useState(null);
    const [categoryData, setCategoryData] = useState({ title: '', description: '' });

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const navigate = useNavigate();

    const handleCardClick = (category_id) => {
        navigate(`/categories/${category_id}`);
    };

    const handleOpenModal = () => {
        setCurrentCategoryId(null); 
        setCategoryData({ title: '', description: '' }); 
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleEditClick = (categoryId) => {
        const category = categoryList.find((cat) => cat.id === categoryId);
        if (category) {
            setCurrentCategoryId(categoryId);
            setCategoryData({ title: category.title, description: category.description });
            setOpenModal(true);
        }
    };

    const handleUpdateCategory = (updatedCategoryData) => {
        dispatch(updateCategory(currentCategoryId, updatedCategoryData)); 
        setOpenModal(false);
    };

    if (loading) return <LoadingDots />;
    if (error) return <ErrorScreen error={error} />;

    return (
        <Container maxWidth="md" sx={{ mt: '130px' }}>
            {userRole === 'admin' && (
                <Button variant="contained" sx={containedButtonStyle} size="small" onClick={handleOpenModal}>
                    Create New Category
                </Button>
            )}
            <Grid container columnSpacing={3}>
                {categoryList.map((category) => (
                    <Grid item xs={12} sm={6} md={6} key={category.id}>
                        <CategoryCard
                            category={category}
                            onCardClick={handleCardClick}
                            isClickable={true}
                            isTruncated={true}
                            onEditClick={() => handleEditClick(category.id)} 
                        />
                    </Grid>
                ))}
            </Grid>

            <CreateCategoryModal
                open={openModal}
                handleClose={handleCloseModal}
                category={currentCategoryId ? categoryData : null}  
                isEditMode={currentCategoryId !== null}  
                onSubmit={handleUpdateCategory}  
            />
        </Container>
    );
}
