const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

exports.getLogin = (req, res, next) => {
    
    res.render('users/login');
};

// exports.postLogin = async(req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   const errors = [];

//   try{
//     const user = await User.findOne({email: email});
//     if(!user){
//        errors.push({msg:`email not exist`});
//        return res.render('users/login',{errors:errors});
//     }else{

//         try{
//             const match = await bcrypt.compare(password, user.password);
//             if(match){
//               return res.redirect('/books');
//             }
//             else{
//                 errors.push({msg:` incorrect password`});
//                  return res.render('users/login',{errors:errors});
//             }
//         }
//         catch(e){
//             console.log(e);
//             return res.redirect('users/login');
//         }
//     }
// }
// catch(e){
//     console.log(e);
// }
// };


exports.getSignup= (req, res, next) => {
  res.render('users/signup');
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
  const errors = [];
  const user = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
  };
  
  if (user.password.length < 6) {
      errors.push({
          msg: `Password must contain atleast 6 Characters`
      });
  }
  if (await emailexist(user.email)) {
      errors.push({
          msg: `Email is already signed up`
      });
  }
  if (errors.length > 0) {
      res.render('users/signup', { errors: errors, user: user });
  } else {
      
          const hashedPassword = await bcrypt.hash(user.password, 12);
          try {
              const updateduser = new User({
                  name: user.name,
                  email: user.email,
                  password: hashedPassword
              });
              await updateduser.save();
              
              res.redirect('/user/login');
          } catch (e) {

              console.log(e);
              res.render('users/singup');

          }
       
  }
};

exports.logOut = (req, res) => {
    req.logOut();
    res.redirect('/user/login');
}