const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key:
        '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'
      }
    })
  );


exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null }

    res.render('auth/login',
    {
        errormsg : message
    });
};


exports.getSignup= (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null
     }
    res.render('auth/signup',{
        errormsg : message
    });
  };
  
exports.postSignup =  async (req, res) => {
    const emailexist = async(email) => {
        try {
            const exist = await User.findOne({ email: email });
            if (exist)
            { return true };
            return false;
        } catch (e) {
            console.log(e);
            return false;
        }
    };
    
    const user = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    
    if (user.password.length < 6) {
      
        req.flash('error', 'Password must contain atleast 6 Characters');
        return res.redirect('/signup');
    }
    if (await emailexist(user.email)) {
       
        req.flash('error', 'Email is already signed up');
        return res.redirect('/signup');
    }
  
            const hashedPassword = await bcrypt.hash(user.password, 12);
            try {
                const updateduser = new User({
                    name: user.name,
                    email: user.email,
                    password: hashedPassword
                });
                await updateduser.save();
                
                res.redirect('/login');
            } catch (e) {
                res.render('auth/singup');
  
            }   
    
  };
  
  exports.logOut = (req, res) => {    
      res.clearCookie('remember_me');
      req.logOut();
      res.redirect('/login');
  }

  

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/reset', {
      errormsg: message
    });
  };
  
exports.postReset =  async(req, res) => {
    crypto.randomBytes(32, async(err, buffer) => {
      if (err) {
        console.log(err);
        return res.redirect('/reset');
      }
      const token = buffer.toString('hex');
      try {
          const user = await User.findOne({ email: req.body.email });

          if (!user) {
            req.flash('error', 'No account with that email found.');
            return res.redirect('/reset');
          }
          user.resetToken = token;
          user.resetTokenExpiration = Date.now() + 3600000;
          await user.save();
          res.redirect('/');
          transporter.sendMail({
            to:'patel.parth.9@ldce.ac.in',
            from: 'parthpatel9265@gmail.com',
            subject: 'Password reset',
            html: `
              <p>You requested a password reset</p>
              <p>Click this <a href="http://localhost:4000/reset/${token}">link</a> to set a new password.</p>
            `
          });
        
        }
        catch(e)
        {
            console.log(e);
        }
    });
};



exports.getNewPassword = async (req, res) => {
    const token = req.params.token;
    try{
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if(user){
        let message = req.flash('error');
        if (message.length > 0) {
          message = message[0];
        } else {
          message = null;
        }
        res.render('auth/new-password',{
          errormsg: message,
          userId: user._id.toString(),
          passwordToken: token
        });
      }
    }
    catch(e)  {
        console.log(e);
      }
  };
  
  exports.postNewPassword = async(req, res) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    try {
    const user =  await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    });
      if(user){
        resetUser = user;
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        await resetUser.save();
        res.redirect('/login');
      }
    }
      catch(e){
        console.log(err);
      }
  };