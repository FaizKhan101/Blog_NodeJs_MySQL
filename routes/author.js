const express = require('express');
const db = require('../data/database')

const router = express.Router();

router.get('/', async (req, res, next) => {
    const query = `
        SELECT * FROM authors
    `
    const [authors] = await db.query(query)

    res.render('authors/author-list', { authors })
})

router.get('/add', async (req, res, next) => {
    res.render('authors/add')
})

router.post('/add', async (req, res, next) => {
    const formName = req.body.name;
    const formEmail = req.body.email;

    const [checkQuery] = await db.query(`SELECT name FROM authors`)

    // console.log(checkQuery);
    for (const i of checkQuery) {
        if (i.name === formName) {
            console.log("if condition");
            return res.redirect('/create-post')
        }
    }

    const query_1 = `
        INSERT INTO authors (name, email) VALUES (?, ?)
    `;
    await db.query(query_1, [formName, formEmail]);
    res.redirect('/authors')
})

router.get('/:id/edit', async (req, res, next) => {
    const id = req.params.id;
    const query = `
        SELECT * FROM authors WHERE authors.id = ?
    `;
    const [author] =  await db.query(query, [id])
    res.render('authors/update', {author: author[0]})
})

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    const query = `
        SELECT * FROM authors WHERE authors.id = ?
    `;
    const [author] =  await db.query(query, [id])
    res.render('authors/author-detail', {author: author[0]})
})

router.post("/:id/edit", async (req, res, next) => {
    const postId = req.params.id;
    const updatedName = req.body.name;
    const updatedEmail = req.body.email;

    const query = `
        UPDATE authors SET name = ?, email = ?
        WHERE id = ? 
    `
    await db.query(query, [updatedName, updatedEmail, postId])

    res.redirect('/authors')
})

router.post('/delete', async (req, res, next) => {
    const deleteId = req.body.id;

    await db.query(`DELETE FROM posts WHERE author_id = ?`, [deleteId])

    await db.query('DELETE FROM authors WHERE authors.id = ?', [deleteId]);
    res.redirect('/authors');
})

module.exports = router;