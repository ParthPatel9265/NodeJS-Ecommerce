const express = require('express');
const cookieParser = require('cookie-parser')
const session = require('express-session');

const connectDB = require('./config/database');

const methodOverride = require('method-override');
const flash = require('connect-flash');
const passport = require('passport');
const app = express();


const MONGODB_URI =
'mongodb+srv://parth:parth@2912@cluster0.a5bgq.mongodb.net/web?retryWrites=true&w=majority';

connectDB(MONGODB_URI);
require('./config/passport')(passport);


app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: {
       
        maxAge:5*1000
        
    }
   
}));

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const bookRoutes = require('./routes/book');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

app.use(flash());

app.get('/', (req, res) => {
     res.redirect('/user/login');
});

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/book', bookRoutes);

app.listen(4000,() => console.log("started"));
  