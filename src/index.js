const express = require('express');
const app = express();
const port = 3000;
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cors = require('cors');
require('dotenv/config');

app.use(cors({ origin: 'http://localhost:5173 '}));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

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
    res.status(200).json({ message: 'hello world' });
});

const funcAuthRoute = require('./routes/auth.route');
funcAuthRoute(app);
const funcWebRoute = require('./routes/web.route');
funcWebRoute(app);
const funcUploadRoute = require('./routes/uploadFile.route');
funcUploadRoute(app);
const funcPostRoute = require('./routes/posts.route');
funcPostRoute(app);

app.listen(port, () => {
    console.log(`\nnavigate to http://localhost:${port}\n`);
});



