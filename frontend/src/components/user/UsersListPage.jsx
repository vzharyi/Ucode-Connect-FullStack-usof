import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import { fetchUsers } from '../../redux/actions/userActions';
import UserCard from './UserCard';
import Container from "@mui/material/Container";
import LoadingDots from "../../utils/LoadingDots";
import ErrorScreen from "../../utils/ErrorScreen";

const UsersListPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, loading, error } = useSelector(state => state.user);
    const currentUserId = useSelector(state => state.auth.user?.id);

    useEffect(() => {
        dispatch(fetchUsers()); 
    }, [dispatch]);

    const handleCardClick = (userId) => {
        navigate(`/users/${userId}`); 
    };

    if (loading) return <LoadingDots/>;
    if (error) return <ErrorScreen error={error}/>;

    return (
        <Container maxWidth="md" sx={{ mt: '130px' }}>
            <Grid container spacing={3}>
                {users.map(user => (
                    <Grid item xs={12} sm={6} md={4} key={user.id}>
                        <UserCard
                            user={user}
                            currentUserId={currentUserId}
                            onCardClick={handleCardClick} 
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default UsersListPage;
