import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../redux/actions/postActions';
import PostList from '../components/post/PostList';
import Filters from '../components/main/Filters';
import Box from '@mui/material/Box';
import { useSearchParams } from 'react-router-dom';
import Container from "@mui/material/Container";

const MainPage = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts.posts);
    const [searchParams, setSearchParams] = useSearchParams();
    const [filters, setFilters] = useState({
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
        category: searchParams.get('category') || '',
        locked: searchParams.get('locked') || '',
        sort: searchParams.get('sort') || '',
    });

    useEffect(() => {
        
        const nonEmptyParams = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value) 
        );
        setSearchParams(nonEmptyParams);

        dispatch(
            fetchPosts(
                1,
                filters.sort,
                filters.startDate,
                filters.endDate,
                filters.category,
                filters.locked
            )
        );
    }, [filters, dispatch, setSearchParams]);

    const handleApplyFilters = (newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    return (
        <Container  maxWidth={false} sx={{
            maxWidth: {
                md: '1100px',
            },
            mt: '130px'
        }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flexGrow: 1 }}>
                <PostList posts={posts} />
            </Box>
            <Box >
                <Filters initialFilters={filters} onApplyFilters={handleApplyFilters} />
            </Box>
        </Box>
        </Container>
    );
};

export default MainPage;
