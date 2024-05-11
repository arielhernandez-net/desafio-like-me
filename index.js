const express = require('express');
const { Pool } = require('pg');
const port = 3000;
const app = express();

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'likeme',
    password: '123456',
    port: 5432,
});

app.use(express.static('public'));
app.use(express.json());

app.post('/post', async (req, res) => {
    const { titulo, img, descripcion } = req.body;
    const setLike = 0;
    try {
        const newPost = await pool.query(
            'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *',
            [titulo, img, descripcion, setLike]
        );
        res.json(newPost.rows[0]);
    } catch (error) {
        console.error('Error al agregar la publicación:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

app.put('/post/:id', async (req, res) => {
    const postId = req.params.id;
    try {
        await pool.query('UPDATE posts SET likes = likes + 1 WHERE id = $1', [postId]);
        res.send('Like agregado correctamente');
    } catch (error) {
        console.error('Error al sumar el like:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

app.get('/posts', async (req, res) => {
    try {
        const allPosts = await pool.query('SELECT * FROM posts');
        res.json(allPosts.rows);
    } catch (error) {
        console.error('Error al obtener las publicaciones:', error.message);
        res.status(500).send('Error interno del servidor');
    }
});

app.listen(port, () => {
    console.log(`Servidor funcionando en puerto ${port}`);
});
