const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
require('dotenv/config');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.use(methodOverride('_method', {methods: ['POST', 'GET']}));
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true, 
    saveUninitialized: true,
}));

app.get('/', (req, res) => {
    res.json({ message: 'hello world' });
});

require('./src/routes/auth.route')(app);
require('./src/routes/web.route')(app);

app.listen(port, () => {
    console.log(`\nnavigate to http://localhost:${port}\n`);
});



