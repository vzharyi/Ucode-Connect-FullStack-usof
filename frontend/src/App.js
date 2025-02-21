import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import MainPage from './pages/MainPage';
import Header from './components/header/Header';
import PostPage from "./components/post/PostPage";
import CategoryPage from "./components/./category/CategoryPage";
import CategoryList from "./components/./category/CategoryList";
import UserPage from "./components/user/UserPage";
import LoginPage from "./components/authentication/LoginPage";
import {useDispatch} from "react-redux";
import {fetchUserData} from "./redux/actions/authActions";
import ScrollToTop from "./utils/ScrollToTop";
import RegisterPage from "./components/authentication/RegisterPage";
import VerifyEmailPage from "./components/authentication/VerifyEmailPage";
import ResetPasswordPage from "./components/authentication/ResetPasswordPage";
import FavoritesPage from "./components/favorites/FavoritesPage";
import UsersListPage from "./components/user/UsersListPage";
import HomePage from "./pages/HomePage";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUserData());
    }, [dispatch]);

    return (
        <Router>
            <Header />
            <ScrollToTop />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/posts" element={<MainPage/>}/>
                    <Route path="/posts/:post_id" element={<PostPage />} />
                    <Route path="/categories" element={<CategoryList />} />
                    <Route path="/categories/:category_id" element={<CategoryPage />} />
                    <Route path="/users/:user_id" element={<UserPage />} />
                    <Route path="/users" element={<UsersListPage />} />
                    <Route path="/users/me" element={<UserPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify-email/:confirm_token" element={<VerifyEmailPage />} />
                    <Route path="/password-reset/:confirm_token" element={<ResetPasswordPage />} />
                    <Route path="/profile" element={<UserPage />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                </Routes>
        </Router>
    );
}

export default App;
