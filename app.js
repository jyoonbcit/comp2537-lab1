// Basic setup
const express = require('express')
// Express-session variable setup
const session = require('express-session')
const bcrypt = require('bcrypt')
const app = express()
// Mongoose model setup
const usersModel = require('./models/w1users')

// Setup for express-session
app.use(session({
    // TODO: change to database session storage
    secret: '1234' // bad secret, should be random normally but ignore for now
}))
app.get('/', (req, res) => {
    res.send('Hello World!')
})

/**
// Middleware (runs synchronously)
const f1 = (req, res, next) => {
    next() // Go to next middleware
}
// You know it's working because next() needs to be called for f2 to be called
const f2 = (req, res) => {
    console.log(2);
    res.send('<h1> anotherRoute </h2>');
    // No more next() because it terminates
}
*/

// Login stuff
// Replaced with MongoDB model
/**
const users = [
    {
        username: 'admin',
        password: 'admin',
        type: 'administrator'
    },
    {
        username: 'user1',
        password: 'pass1',
        type: 'non-administrator'
    }
]
*/

app.get('/login', (req, res) => {
    res.send(`
    <form action='/login' method='post'>
        <input type='text' name='username' placeholder='Enter your name' />
        <input type='text' name='password' placeholder='Enter your password' />
        <input type='submit' value='Login' />
    </form>
    `)
})
app.use(express.urlencoded({ extended: false })) // built-in express JS function, lets you read username & password fields
// TODO: find out why we use async here
app.post('/login', async (req, res) => {
    try {
        // set a global variable to true if the user is authenticated
        const result = await usersModel.findOne({
            username: req.body.username
        })
        if (result === null) {
            res.send(`
            <h1> No such user [1] </h1>
            `)
        } else if (bcrypt.compareSync(req.body.password, result?.password)) {
            req.session.GLOBAL_AUTHENTICATED = true;
            req.session.loggedUsername = req.body.username;
            req.session.loggedPassword = req.body.password;
            res.redirect('/');
        } else {
            res.send(`
            <h1> Wrong password [2] </h1>
            `)
        }
    } catch (err) {
        console.log(err);
    }}
);
// 404 Handler
app.get('*', (req, res) => {
    res.status(404).send(`
    <h1> Error 404: Page not found. </h1>
    `);
});
/**
app.post('/login', (req, res) => {
    if (users.find((user) => user.username === req.body.username && user.password === req.body.password)) {
        req.session.GLOBAL_AUTHENTICATED = true; // need express-session npm library for req.session
    }
    res.redirect('/protectedRoute');
})
*/

// For authenticated users only
const authenticatedOnly = (req, res, next) => {
    if (!req.session.GLOBAL_AUTHENTICATED) {
        return res.status(401).json({ error: 'not authenticated' });
    }
    next();
}
/**
const authenticationSuccessful = (req, res) => {
    res.send(`
    <h1> Logged on. </h1>
    `);
}
app.use(authenticationSuccessful)
*/
app.use(authenticatedOnly)
/**
app.get('/protectedRoute', authenticatedOnly, authenticationSuccessful); // loads /protectedRoute, runs f1 f2
*/

app.use(express.static('public')) // serves static files from public folder, otherwise error for image
app.get('/protectedRoute', authenticatedOnly, (req, res) => {
    // Random number between 1 and 3 (inclusive)
    const randomImageNumber = Math.floor(Math.random() * 3) + 1;
    const imageName = `00${randomImageNumber}.png`;
    HTMLResponse = `
    <h1> Protected Route </h1> 
    <br> 
    <p> Picture ${imageName} </p>
    <img src="${imageName}" />
    `;
    res.send(HTMLResponse)
}); // loads /protectedRoute, runs f1 f2


// For Admins only
const protectedRouteForAdminsOnlyMiddlewareFunction = async (req, res, next) => {
    try {
        const result = await usersModel.findOne(
            {
                username: req.session.loggedUsername
            }
        )
        if (result?.type != 'administrator') {
            return res.send(`
            <h1> You are not an admin </h1>
            `)
        }
        next();
    } catch (err) {
        console.log(err);
    }
};
app.use(protectedRouteForAdminsOnlyMiddlewareFunction);

app.get('/protectedRouteForAdminsOnly', (req, res) => {
    res.send(`
    <h1> protectedRouteForAdminsOnly </h1>
    `);
});
// 404 Handler
app.get('*', (req, res) => {
    res.status(404).send(`
    <h1> Error 404: Page not found. </h1>
    `);
});

module.exports = app;