import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import {blacklistToken} from '../middleware/tokenBlacklist.js';
import jwt from 'jsonwebtoken';
import {Op} from 'sequelize';

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "vadim.zhary@gmail.com",
        pass: "phyrtnvpprdnqraa",
    },
});

class AuthenticationController {
    async register(req, res) {
        try {
            const {login, password, password_confirmation, full_name, email} = req.body;
            if (!full_name || !login || !password || !password_confirmation || !email) {
                return res.status(400).json({error: 'All required fields must be filled'});
            }
            if (password !== password_confirmation) {
                return res.status(400).json({error: 'Passwords do not match'});
            }

            const existingUser = await User.findOne({where: {[Op.or]: [{login}, {email}]}});
            if (existingUser) {
                return res.status(400).json({error: 'Login or email is already in use'});
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const defaultProfilePicture = '/uploads/avatars/default.png';

            const newUser = await User.create({
                login,
                password: hashedPassword,
                full_name: full_name,
                email,
                email_verified: false,
                profile_picture: defaultProfilePicture,
            });

            const verificationToken = jwt.sign({id: newUser.id}, 'your_jwt_secret', {expiresIn: '30m'});
            const verificationLink = `http://localhost:3000/verify-email/${verificationToken}`;

            await transporter.sendMail({
                from: '"QFlow Registration" <support@usof.com>',
                to: email,
                subject: "Confirm Your Email for QFlow",
                text: `Welcome to QFlow! Please confirm your email by clicking the link below: ${verificationLink}`,
                html: `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0;  Серый фон */
                    color: #333;
                    padding: 20px;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    font-size: 24px;
                    color: #333;
                    margin-bottom: 10px;
                }
                .subheader {
                    font-size: 16px;
                    color: #555;
                    margin-top: 10px;
                    text-align: center;
                }
                .cta-button {
                    display: block;
                    width: 100%;
                    max-width: 200px;
                    margin: 20px auto;
                    padding: 12px 20px;
                    background-color: #e9ecf2;  Легкий серый фон кнопки */
                    color: #46526a; 
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                    border-radius: 10px;
                    text-decoration: none;
                    transition: background-color 0.3s, color 0.3s;
                }
                .cta-button:hover {
                    background-color: #d1d7e2; 
                    color: #000; 
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 14px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    Welcome to QFlow!
                </div>
                <div class="subheader">
                    We're excited to have you onboard. To complete your registration, please confirm your email by clicking the button below.
                </div>
                <a href="${verificationLink}" class="cta-button">Confirm Your Email</a>
                <div class="footer">
                    If you have not requested this registration, please ignore this email. Your email address will not be verified until you confirm it.
                </div>
            </div>
        </body>
    </html>`
            });


            return res.status(201).json({message: 'Registration successful. Please confirm your email'});
        } catch (error) {
            return res.status(500).json({error: 'Registration error', details: error.message});
        }
    }

    async login(req, res) {
        try {
            const {login, password} = req.body;

            const user = await User.findOne({where: {login}});
            if (!user) {
                return res.status(400).json({error: 'Invalid login or password'});
            } else if (!user.email_verified) {
                return res.status(400).json({error: 'Email not verified'});
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({error: 'Invalid login or password'});
            }

            const token = jwt.sign({id: user.id}, 'your_jwt_secret', {expiresIn: '12h'});

            return res.status(200).json({token});
        } catch (error) {
            return res.status(500).json({error: 'Authorization error'});
        }
    }

    async logout(req, res) {
        try {
            const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

            if (!token) {
                return res.status(400).json({error: 'Token not provided'});
            }

            blacklistToken(token);
            return res.status(200).json({message: 'Successfully logged out'});
        } catch (error) {
            return res.status(500).json({error: 'Logout error', details: error.message});
        }
    }

    async sendPasswordResetEmail(req, res) {
        const {email} = req.body;
        if (!email) return res.status(400).json({error: "Email is required"});

        const resetToken = jwt.sign({email}, 'your_jwt_secret', {expiresIn: '30m'});

        const resetLink = `http://localhost:3000/password-reset/${resetToken}`;

        try {
            await transporter.sendMail({
                from: '"Support" <support@usof.com>',
                to: email,
                subject: "Password Reset Request",
                text: `We received a request to reset your password. Please click the link below to reset your password: ${resetLink}`,
                html: `
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f0f0; 
                    color: #333;
                    padding: 20px;
                }
                .container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    font-size: 24px;
                    color: #333;
                    margin-bottom: 10px;
                }
                .subheader {
                    font-size: 16px;
                    color: #555;
                    margin-top: 10px;
                    text-align: center;
                }
                .cta-button {
                    display: block;
                    width: 100%;
                    max-width: 200px;
                    margin: 20px auto;
                    padding: 12px 20px;
                    background-color: #e9ecf2; 
                    color: #46526a; 
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                    border-radius: 10px;
                    text-decoration: none;
                    transition: background-color 0.3s, color 0.3s;
                }
                .cta-button:hover {
                    background-color: #d1d7e2; 
                    color: #000; 
                }
                .footer {
                    text-align: center;
                    margin-top: 30px;
                    font-size: 14px;
                    color: #777;
                }
            </style>
        </head>
        <body>
            <div class="container">
            <div class="header">
                    Welcome to QFlow!
                </div>
                <div class="header">
                    Password Reset Request
                </div>
                <div class="subheader">
                    We received a request to reset your password. If this was not you, please ignore this email. Otherwise, click the button below to reset your password.
                </div>
                <a href="${resetLink}" class="cta-button">Reset Your Password</a>
                <div class="footer">
                    If you did not request this password reset, please ignore this email. Your password will not be changed unless you click the button above.
                </div>
            </div>
        </body>
    </html>`
            });


            res.status(200).json({message: 'Password reset link sent to your email'});
        } catch (error) {
            console.error("Error sending password reset email:", error);
            res.status(500).json({error: 'Error sending email'});
        }
    }

    async confirmNewPassword(req, res) {
        const { confirm_token } = req.params;
        const { newPassword, confirmPassword } = req.body;

        if (!newPassword || !confirmPassword) {
            return res.status(400).json({ error: 'Both new password and confirm password are required' });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: 'Passwords do not match' });
        }

        try {
            const decoded = jwt.verify(confirm_token, 'your_jwt_secret');
            const { email } = decoded;

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();

            res.status(200).json({ message: 'Password updated successfully' });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(400).json({ error: 'Token expired, please request a password reset again' });
            }
            res.status(500).json({ error: 'New password confirmation error' });
        }
    }


    async verifyEmail(req, res) {
        const {confirm_token} = req.params;

        if (!confirm_token) {
            return res.status(400).json({error: 'Token is missing in the request'});
        }

        try {
            const decoded = jwt.verify(confirm_token, 'your_jwt_secret');
            const user = await User.findByPk(decoded.id);

            if (!user) {
                return res.status(404).json({error: 'User not found'});
            }
            user.email_verified = true;
            await user.save();

            const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '30m' });

            res.status(200).json({
                message: 'Email successfully verified',
                token
            });
        } catch (error) {
            console.error('Verification error:', error);
            return res.status(400).json({error: 'Invalid or expired token'});
        }
    }

    async findUser(req, res) {
        try {
            const user = await User.findByPk(req.user.id);
            if (!user) return res.status(404).json({ error: 'User not found' });
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }
}

export default new AuthenticationController();
