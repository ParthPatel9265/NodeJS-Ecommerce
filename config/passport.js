const LocalStrategy = require('passport-local').Strategy;
const RememberMeStrategy = require('passport-remember-me').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');
const uid = require('uid2');
const Token = require('../models/token');
const mongoose = require('mongoose');
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
                        return done(null, user);
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
    

   passport.use(new RememberMeStrategy(

    function(token, done) {
    Token.findOneAndRemove({ token: token })
    .populate('userId')
    .exec( function (err, doc) {
        if(err) return done(err);
        if(!doc) return done(null,false);
        return done(null, doc.userId);
    });
    },

    function(user, done) {
        function generatetoken(number){
            return uid(number);
         }
        tokens= generatetoken(64);
        var tk1 = new Token({  
            token: tokens,
            userId:user._id
          });
        tk1.save(function(err) {
            if (err) { return done(err); }
            return done(null, tokens);
          });
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
