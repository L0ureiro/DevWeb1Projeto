const db = require('./db')

const express = require('express');
const session = require('express-session')
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'segredoseguro',
    resave: false,
    saveUninitialized: true
}))

const isAuthenticated = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
}

app.get('/', (req, res) => {
    res.render('index', {
        users: [
            { name: 'Oi', email: 'oi@sdds.com' },
            { name: 'Tchau', email: 'tchau@superei.com' }
        ], isLogged: true
    });
});

app.route('/login')
    .get((req, res) => {
        res.render('login')
    })
    .post((req, res) => {
        const { email, password } = req.body
        const sql = 'SELECT id FROM users WHERE email = ? AND password = ?'
        db.get(sql, [email, password], (err, row) => {
            if (err) {
                return console.error(err.message);
            }

            if (row) {
                req.session.isAuthenticated = true;
                res.redirect('/')
            }

            res.status(404).send()
        })
    })

app.route('/user')
    .post((req, res) => {
        const { name, email, password, rank } = req.body
        const sql = 'INSERT INTO users (name, email, password, rank) VALUES (?, ?, ?, ?)';
        const params = [name, email, password, rank];

        db.run(sql, params, function (err) {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Row added: ${this.lastID}`);
            // res.status(200).json({id: this.lastID, ...req.body})
            res.redirect('/')
        });
    })
    .get(isAuthenticated, (req, res) => {
        res.send(200).json({deucerto: 'sim1'})
    })

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
