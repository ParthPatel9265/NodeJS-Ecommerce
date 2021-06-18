
const Book = require('../models/book');

const books_per_page = 3;

exports.getBooks = async(req, res) => {
   
    const page = +req.query.page || 1;
    let totalBook;
  
    try{
      const countbook = await Book.find().countDocuments()
      totalBook = countbook;
      try{
      const books = await Book.find().skip((page - 1) * books_per_page).limit(books_per_page);
      res.render('books/home', {
        books:books,
        user:req.user,
        path: '/book',
        currentPage: page,
        hasNextPage: books_per_page * page < totalBook,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalBook / books_per_page)
      });
      }
      catch(e){
        console.log(e);
    }
}
    catch(e){
        console.log(e);
    }
}

exports.getAdd =  (req, res) => {
    res.render('books/add',{path:'book/add'});
}

exports.postAdd =  async (req, res) => {
    const book = {
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
        price:  parseFloat(req.body.price)
    };
    try{
        const newBook = new Book(book);
        await newBook.save();
        res.redirect('/book');
    }catch(e){
        console.log(e);
        res.render('books/add', {book: book});
    }
}


exports.getEdit =  async (req, res)=>{
    try{
    const book = await Book.findById(req.params.id);
    res.render('books/edit', {book: book});
    }
    catch(e){
        console.log(e);
    }
}

exports.postEdit = async (req, res)=>{
    const book = {
        title: req.body.title,
        image: req.body.image,
        description: req.body.description,
        price:  parseFloat(req.body.price)
    };
    try{
        const editBook = await Book.findByIdAndUpdate(req.params.id, book);
        await editBook.save();
        res.redirect('/admin');
    }catch(e){
        console.log(e);
    }
}

exports.delete = async (req, res) => {
    try{
       await Book.findByIdAndDelete(req.params.id);
       res.redirect('/admin');
    }
    catch(e){
        console.log(e);
        
    }
};
exports.getBookDetails = async(req, res)=>{
    try{
        const book = await Book.findById(req.params.id).populate('comments').exec();
        res.render('books/bookdetails', {book: book, user: req.user,path:'/book/bookdetails/${req.params.id}'});
    }
    catch(e){
        console.log(e);
    }
};