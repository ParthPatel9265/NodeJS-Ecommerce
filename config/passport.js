const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');


module.exports =  async (passport) => {
        passport.use(new LocalStrategy({usernameField: 'email'}, async (email, password, done)=>{
        try{
            const user = await User.findOne({email: email});
            if(!user)
            {
             return done(null, false, {message: 'email is not valid'});
            }
            else
            {
                try{
                    const isMatch = await bcrypt.compare(password, user.password);
                    if(isMatch)
                    {
                        return done(null, user, {message: 'login successful'});
                    }
                    else
                    {
                        return done(null, false, {message: 'password incorrect'});
                    }
                }
                catch(e)
                {
                    console.log(e);
                    return done(e);
                }
            }
        
        }catch(e)
        {
            console.log('Server Error');
            return done(e);
        }
    }));
    
    passport.serializeUser((user, done)=>{
        return done(null, user.id);
    });
    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user)=>{
            return done(err, user);
        });
    });
};