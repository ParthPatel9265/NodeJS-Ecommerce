const Book = require('../models/book');
const User = require('../models/user');
const Order = require('../models/order');
exports.getAdminDashboard = async (req, res) => {
    try{  
        const books = await Book.find();
        const users = await User.find();
        const orders = await Order.find().sort({createdAt:-1}).populate("user").populate("details.book").exec();
        res.render('admin/dashboard', {user: req.user,books,users,orders,path:'/admin'});
    }
    catch(e)
    {
        console.log(e);
    }

}

