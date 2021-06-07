const express = require('express');
const session = require('express-session');
const connectDB = require('./config/database');
const flash = require('connect-flash');
const passport = require('passport');
const app = express();

connectDB('mongodb+srv://parth:parth@2912@cluster0.a5bgq.mongodb.net/web?retryWrites=true&w=majority');
require('./config/passport')(passport);
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie:{
        maxAge:2*60*1000
    }
}));

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const bookRoutes = require('./routes/book');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));


app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.get('/', (req, res) => {
     res.redirect('/user/login');
});


app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/book', bookRoutes);

app.listen(4000,() => console.log("started"));
  