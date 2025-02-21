import User from '../models/user.js';
import Post from '../models/posts.js';
import Category from '../models/categories.js';
import bcrypt from 'bcrypt';
import {Op} from 'sequelize';
import fs from 'fs';
import {fileURLToPath} from 'url';
import path from 'path';
import {getPagination, updateUserRating, updatePostRating} from '../utils/utils.js';
import Like from "../models/likes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class UserController {
    async getUsers(req, res) {
        try {
            const {user_id: userId} = req.params;

            if (userId) {
                await updateUserRating(userId);
                const user = await User.findByPk(userId, {
                    attributes: ['id', 'login', 'full_name', 'email', 'profile_picture', 'rating', 'role']
                });

                if (!user) {
                    return res.status(404).json({error: 'User not found'});
                }
                return res.status(200).json(user);
            } else {
                const users = await User.findAll({
                    attributes: ['id', 'login', 'full_name', 'email', 'profile_picture', 'rating', 'role']
                });

                if (!users.length) {
                    return res.status(404).json({error: 'No users found'});
                }

                for (const user of users) {
                    await updateUserRating(user.id);
                }

                return res.status(200).json(users);
            }
        } catch (error) {
            return res.status(500).json({error: 'Failed to retrieve data'});
        }
    }

    async getUserPosts(req, res) {
        try {
            const {user_id: userId} = req.params;


            const requesterId = req.user?.id || null;
            const requesterRole = req.user?.role || null;


            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }


            const whereCondition = {
                author_id: userId,
                ...(requesterId !== parseInt(userId) && requesterRole !== 'admin' ? {status: 'active'} : {}),
            };


            const posts = await Post.findAll({
                where: whereCondition,
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: ['id', 'full_name', 'profile_picture'],
                    },
                    {
                        model: Category,
                        as: 'categories',
                        attributes: ['title'],
                        ...(req.query.categories
                            ? {where: {id: req.query.categories.split(',').map(Number)}}
                            : {}),
                    },
                    {
                        model: Like,
                        as: 'likes',
                        attributes: ['id', 'author_id', 'type'],
                    },
                ],
            });


            return res.status(200).json(posts);
        } catch (error) {
            console.error('Error retrieving user posts:', error);
            return res.status(500).json({error: 'Error retrieving user posts', details: error.message});
        }
    }


    async createUser(req, res) {
        try {
            const {login, password, passwordConfirmation, email, role, full_name} = req.body;

            if (!login || !password || !passwordConfirmation || !email || !role || !full_name) {
                return res.status(400).json({error: 'All fields are required'});
            }

            if (password !== passwordConfirmation) {
                return res.status(400).json({error: 'Password and confirmation do not match'});
            }

            const existingUser = await User.findOne({where: {[Op.or]: [{login}, {email}]}});
            if (existingUser) {
                return res.status(400).json({error: 'Username or email already in use'});
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                login,
                password: hashedPassword,
                email,
                role,
                full_name
            });

            return res.status(201).json(newUser);
        } catch (error) {
            return res.status(500).json({error: 'Error creating user', details: error.message});
        }
    }

    async uploadAvatar(req, res) {
        if (!req.file) {
            return res.status(400).json({message: 'No file uploaded'});
        }

        try {

            const fileUrl = `/uploads/user_avatars/${req.file.filename}`;


            const userId = req.user.id;
            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({message: 'User not found'});
            }

            user.profile_picture = fileUrl;
            await user.save();


            res.json({
                message: 'Avatar uploaded successfully',
                profile_picture: fileUrl
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({message: 'Failed to upload avatar', details: error.message});
        }
    };

    async updateProfile(req, res) {
        try {
            const {user_id: userId} = req.params;
            const {login, full_name, profile_picture, role, old_password, new_password} = req.body;
            const requesterId = req.user.id;
            const requesterUser = await User.findByPk(requesterId);
            const user = await User.findByPk(userId);
            const isAdmin = requesterUser.role === 'admin';

            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }

            if (!isAdmin && requesterId !== parseInt(userId)) {
                return res.status(403).json({error: 'You are not authorized to update this user profile'});
            }

            if (login && login !== user.login) {
                const existingUser = await User.findOne({where: {login}});
                if (existingUser) {
                    return res.status(400).json({error: 'Username is already in use'});
                }
            }


            const updatedFields = {
                login: login || user.login,
                full_name: full_name || user.full_name,
                profile_picture: profile_picture || user.profile_picture,
            };


            if (new_password) {

                if (!old_password) {
                    return res.status(400).json({error: 'Old password is required!'});
                }

                const isPasswordValid = await bcrypt.compare(old_password, user.password);
                if (!isPasswordValid) {
                    return res.status(400).json({error: 'Old password is incorrect!'});
                }


                const hashedPassword = await bcrypt.hash(new_password, 10);


                updatedFields.password = hashedPassword;
            }


            if (isAdmin && role) {
                updatedFields.role = role;
            }


            await user.update(updatedFields);


            const updatedUser = {
                id: user.id,
                login: user.login,
                full_name: user.full_name,
                email: user.email,
                profile_picture: user.profile_picture,
                rating: user.rating,
                role: user.role,
            };

            return res.status(200).json(updatedUser);
        } catch (error) {
            return res.status(500).json({error: 'Error updating profile'});
        }
    }

    async deleteUser(req, res) {
        try {
            const {user_id: userId} = req.params;

            const user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }

            await user.destroy();
            return res.status(200).json({message: 'User deleted successfully'});
        } catch (error) {
            return res.status(500).json({error: 'Error deleting user'});
        }
    }
}

export default new UserController();
