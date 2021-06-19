const User = require('../models/user');
const Book = require('../models/book');
const Order = require('../models/order');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const passport = require('passport');
const stripe = require('stripe')("##################");
const authenticate = require('../middleware/authenticate');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { getMaxListeners } = require('../models/user');

const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key:
        '##############################'
      }
    })
  );


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



exports.addCart = async(req,res) => {
    try{
        const book = await Book.findById(req.params.id);
        req.user.carts.push({book});
        User.findByIdAndUpdate(req.user.id, req.user, (err, user)=>{
            if(err){
                console.log(err);
               
            }else{
                 res.redirect('/user/cart');
            }
        });
    }catch(e){
        console.log(e);
        
    }
}
exports.getCart = (req, res) => {
    
          User.findById(req.user.id)
            .populate("carts.book")
            .exec((err, user) => {
                if (err) {
                    res.redirect('/book');
                } else {
                    res.render('users/cart', { user: user,path:'/user/cart'});
                }
            }); 
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
                 res.redirect('/user/cart');
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


exports.postOrder = async (req, res) => {
    const {stripeEmail, stripeToken } = req.body;
    const customer = await stripe.customers.create({
        email: stripeEmail,
        source: stripeToken,
    });
    User.findById(req.user.id)
    .populate("carts.book")
    .exec( async(err, user)=>{
        if(err){
            req.flash('error', 'error in further processing')
            res.redirect('/book');
        }
        else{
            let totalPrice = 0;
            user.carts.forEach(product => {
                totalPrice += product.quantity * product.book.price
            });
            try
            {
            const charge = await stripe.charges.create({
                customer: customer.id,
                description: "Order of Books",
                amount: totalPrice * 100,
                currency: 'inr',
        
            });
            
            const order = new Order({
                    user,
                    details:user.carts,
                    price: totalPrice
                });
            await order.save();
            let updatedUser = req.user;
            updatedUser.carts = [];
            await User.findByIdAndUpdate(updatedUser.id, updatedUser);
            let message = `<table>
            <thead>
                <tr>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Quantity</th>
                </tr>
            </thead>
           <tbody>
            `;
            user.carts.forEach(item => {
            message += `
            <tr>
                <td> ${item.book.title} </td>
                <td>₹ ${item.book.price} </td>
                <td>${item.quantity}</td>
            </tr>
            `
            });
            message+=`
            </tbody>
            </table>
           
            <h3>Total Amount: ₹ ${totalPrice}</h3>
            <p>Download order receipt from <a href=${charge.receipt_url}>here</a></p>
            
            <h4>Thanks For Shopping With Us</h4>
            <p>admin,<br> Book Store</p>
            </body>`
            transporter.sendMail({
                to: "patel.parth.9@ldce.ac.in",
                from: 'parthpatel9265@gmail.com',
    
                subject: 'Order succeeded!',
                html: message
              });


            req.flash('success', 'order successful');
            res.redirect('/user/order');
            
            }
            catch (e)
            {
                 console.log(e);
            }
        }
    });
  };
  

exports.getOrder = async (req, res) => {
    const orders = await Order.find({user: req.user}).sort({createdAt:-1}).populate("details.book").exec();
    res.render('users/orders', {orders,user:req.user,path:'/user/order'});
};


