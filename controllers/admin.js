const Book = require('../models/book');
exports.getAdminDashboard = async (req, res) => {
    try{  
        const books = await Book.find();
        res.render('admin/dashboard', {admin: req.user,books});
    }
    catch(e)
    {
        console.log(e);
    }

}

