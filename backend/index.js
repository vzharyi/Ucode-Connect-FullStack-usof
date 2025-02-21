import adminRoutes from './routes/adminRoutes.js';
import express from 'express';
import http from 'http';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import routes from './routes/routes.js';

const app = express();
const server = http.createServer(app);




const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/admin', adminRoutes);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', routes);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Admin Panel running on http://localhost:${PORT}/admin`);
});
