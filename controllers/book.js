
const Book = require('../models/book');

exports.getBooks = (req, res) => {
    res.render('books/home');
}

exports.getAdd =  (req, res) => {
    res.render('books/add');
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
        res.render('books/edit', {book: book});
    }
}