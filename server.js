const { db } = require('./db');

const express = require('express')
const session = require('express-session')
const bcrypt = require('bcrypt')
const path = require('path')
const passport = require('passport')
const sqlite3 = require('sqlite3').verbose();
const flash = require('express-flash')
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(express.static(path.join(__dirname, 'public'), { extensions: ['html'] }))
app.use(express.json());
app.use(flash())
app.use(session({
    secret: 'segredosegurosecreto',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
 
passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
          console.error('Error querying the database:', err.message)
          return done(err)
        }
  
        if (!user) {
          console.log('User not found')
          return done(null, false, { message: 'Incorrect username.' })
        }

        const isPasswordHashed = user.password.startsWith('$2b$');
        
        let passwordMatch;
        if (isPasswordHashed) {
          passwordMatch = await bcrypt.compare(password, user.password);
        } else {
          passwordMatch = password === user.password;
        }
  
        if (!passwordMatch) {
          console.log('Incorrect password')
          return done(null, false, { message: 'Incorrect password.' })
        }
  
        console.log('User authenticated:', user)
        return done(null, user)
      });
    })
  );
  
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  
  passport.deserializeUser((id, done) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
      done(err, user)
    })
  })

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
};

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
    .get(checkAuthenticated, (req, res) => {
        res.render('profile')
    })
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

app.route('/profile')
    .get(checkAuthenticated, (req, res) => {
        res.render('profile')
    })

app.put('/edit-profile', async (req, res) => {
    try {
        const userId = req.user.id
        const { name, email, password, rank } = req.body
        let hashedPassword = req.user.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 5);
        }
        const sql = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
        const params = [name, email, hashedPassword, userId];
        db.run(sql, params, function (err) {
            if (err) {
                console.error(err.message);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            console.log(`User profile updated: ${userId}`);
            res.redirect('/profile');
        });
    } catch (error) {
        console.error(error);
        res.redirect('/profile'); 
    }
});

app.delete('/delete-profile', (req, res) => {
    const userId = req.user.id; 

    db.run('DELETE FROM users WHERE id = ?', [userId], (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      req.logout((err) => {
        if (err) {
          return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.redirect('/');
      });
    });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`)
})
