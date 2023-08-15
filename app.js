const path = require('path');

const express = require('express');

const blogRoutes = require('./routes/blog')
const authorRoutes = require('./routes/author')


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));

app.use('/authors', authorRoutes)
app.use('/', blogRoutes)

app.listen('5000', () => {
    console.log("Server started at port 5000!");
})
