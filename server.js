const { db, getUserByEmail, getUserById } = require('./db');

const express = require('express')
const session = require('express-session')
const bcrypt = require('bcrypt')
const path = require('path')
const passport = require('passport')
const sqlite3 = require('sqlite3').verbose();
const flash = require('express-flash')
const LocalStrategy = require('passport-local').Strategy;


const app = express()
const port = 3000

//const initializePassport = require('./passport-config')
//initializePassport(passport, getUserByEmail)

app.set('view engine', 'ejs')


app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: 'segredosegurosecreto',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// app.js

// ... (other imports and setup)

// Passport Configuration
 
passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
          console.error('Error querying the database:', err.message)
          return done(err)
        }
  
        if (!user) {
          console.log('User not found')
          return done(null, false, { message: 'Incorrect username.' })
        }
  
        const passwordMatch = bcrypt.compareSync(password, user.password)
  
        if (!passwordMatch) {
          console.log('Incorrect password')
          return done(null, false, { message: 'Incorrect password.' })
        }
  
        console.log('User authenticated:', user)
        return done(null, user)
      });
    })
  );
  
  // ... (other routes and start the server)
  
  
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  
  passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
      done(err, user)
    })
  })

app.use((req, res, next) => {
    res.locals.user = req.user
    next()
  });

app.get('/', (req, res) => {
    res.render('index')
});

app.route('/registration')
    .get((req, res) => {
        res.render('registration')
    })

app.route('/login')
    .get((req, res) => {
        res.render('login')
    })

    .post(passport.authenticate('local',{
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    }))

app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' })
        }
        res.redirect('/')
      })
    })

app.route('/user')
    .post(async (req, res) => {
        try {
            const { name, email, password, rank } = req.body
            const hashedPassword = await bcrypt.hash(password, 5)
            const sql = 'INSERT INTO users (name, email, password, rank) VALUES (?, ?, ?, ?)';
            const params = [name, email, hashedPassword, rank]

            db.run(sql, params, function (err) {
                if (err) {
                    console.error(err.message)
                    return res.status(500).json({ error: 'Internal Server Error' })
                }
                console.log(`Row added: ${this.lastID}`)
                res.redirect('/')
            });
        } catch (error) {
            console.error(error)
            res.redirect('/registration')
        }
    });


app.route('/game')
    .get((req, res) => {
        res.render('game')
    })

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
