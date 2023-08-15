const express = require('express');
const db = require('../data/database')

const router = express.Router();

router.get('/', (req, res, next) => {
    res.redirect('/posts')
})

router.get('/posts', async (req, res, next) => {
    const query = `
        SELECT posts.*, authors.name AS author_name FROM posts
        INNER JOIN authors ON (posts.author_id = authors.id)
    `
    const [posts] = await db.query(query)

    res.render('posts-list', { posts })
})

router.get('/posts/:id', async (req, res, next) => {
    const query = `
        SELECT posts.*, authors.name AS author_name FROM posts 
        INNER JOIN authors ON (posts.author_id = authors.id)
        WHERE posts.id = ?
    `
    const [posts] = await db.query(query, [req.params.id])

    if (!posts || posts.length === 0) {
        return res.status(404).redirect('/posts')
    }

    const post = posts.at(0)

    post.date = Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'medium' }).format(post.date)

    res.render('post-detail', { post })
})

router.get('/create-post', async (req, res, next) => {
    const query = `
        SELECT id,name FROM authors
    `
    const [author_names] = await db.query(query)
    res.render('create-post', { authors: author_names })
})

router.post('/create-post', async (req, res, next) => {
    const formTitle = req.body.title;
    const formSummary = req.body.summary;
    const formBody = req.body.content;
    const formAuthorId = req.body.author;
    const query = `
        INSERT INTO posts (title, summary,body,author_id) VALUES (?, ?, ?, ?)
    `
    await db.query(query, [formTitle, formSummary, formBody, formAuthorId]);
    res.redirect('/posts')
})

router.get('/posts/:id/edit', async (req, res, next) => {
    const id = req.params.id;
    const query = `
        SELECT * FROM posts WHERE posts.id = ?
    `;
    const [post] =  await db.query(query, [id])
    res.render('update-post', {post: post[0]})
})

router.post("/posts/:id/edit", async (req, res, next) => {
    const postId = req.params.id;
    const updatedTitle = req.body.title;
    const updatedSummary = req.body.summary;
    const updaredBody = req.body.content;

    const query = `
        UPDATE posts SET title = ?, summary = ?, body = ?
        WHERE id = ? 
    `
    await db.query(query, [updatedTitle, updatedSummary, updaredBody, postId])

    res.redirect('/posts')
})

router.post('/post/delete', async (req, res, next) => {
    const deleteId = req.body.id;
    await db.query('DELETE FROM posts WHERE posts.id = ?', [deleteId]);
    res.redirect('/posts');
})

module.exports = router;