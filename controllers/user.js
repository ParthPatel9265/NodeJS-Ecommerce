const User = require('../models/user');
const Book = require('../models/book');
const bcrypt = require('bcrypt');
const passport = require('passport');

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
      message = message[0];
    } else {
      message = null }

    res.render('users/login',
    {
        errormsg : message
    });
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

exports.addCart = async(req,res) => {
    try{
        const book = await Book.findById(req.params.id);
        req.user.carts.push({book});
        User.findByIdAndUpdate(req.user.id, req.user, (err, user)=>{
            if(err){
                console.log(err);
               
            }else{
                 res.redirect('/user/dashboard');
            }
        });
    }catch(e){
        console.log(e);
        
    }
}
exports.getDashboard = (req, res) => {
    if(req.user.role !== 'admin'){
    
            User.findById(req.user.id)
            .populate("carts.book")
            .exec((err, user) => {
                if (err) {
                    res.redirect('/book');
                } else {
                    // console.log(user.carts);
                    res.render('users/dashboard', { user: user });
                }
            }); 
        
    }else{
         res.redirect('/admin');
    }
  };

exports.getdeletefromCart =  async (req, res) => {
    try{
        const getuser = await User.findById(req.user.id);
        const index = getuser.carts.findIndex(book => book.equals(req.params.id));
        getuser.carts.splice(index, 1); //remove one item from index number
        User.findByIdAndUpdate(getuser.id, getuser, (err, user)=>{
            if(err){
                console.log(err);
                
            }else{
                  // console.log(user);
                 res.redirect('/user/dashboard');
            }
        });
    }catch(e){
        console.log(e);
        
    }
  };

  exports.postCheckout =  async (req, res) => {
    try{
       
        req.user.carts.forEach(product => {
             product.quantity = req.body[product.book];
        });

        await User.findByIdAndUpdate(req.user.id, req.user);

        User.findById(req.user.id)
        .populate("carts.book")
        .exec((err, user)=>{
            if(err){
                res.redirect('/book');
            }
            else{
                let totalPrice = 0;
                user.carts.forEach(product => {
                    totalPrice += product.quantity * product.book.price
               });
               res.render('users/checkout', {user, totalPrice});
            }
        });
    }catch(e){
        console.log(e);
      
    }
};