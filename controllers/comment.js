const Comment = require('../models/comment');
const Book = require('../models/book');

exports.getComment = (req, res) => {
    res.render('bookcomment/add', {id: req.params.id});
};

exports.postComment = async (req, res) => {
    const comment = {
        title: req.body.title,
        content : req.body.content
    };
    try{
        const add = await Comment.create(comment);
        add.publisher.id = req.user._id;
        add.publisher.name = req.user.name;
        await add.save();
        try{
            const book = await Book.findById(req.params.id);
            book.comments.push(add);
            const saveBook =  await book.save();
            res.redirect(`/book/bookdetails/${saveBook._id}`);
        }catch(e){
            console.log(e);
            res.render('bookcomment/add', {id: req.params.id, comment: comment});
        }
    }catch(e){
        res.render('bookcomment/add', {id: req.params.id, comment: comment});
    }
};

exports.getEdit =   async (req, res) => {
    const comment = await Comment.findById(req.params.cid);
    res.render('bookcomment/edit', {comment: comment, id: req.params.id});
};

exports.putEdit = async (req, res) => {
    const comment = {
        title: req.body.title,
        content: req.body.content
    };
    try{
        await Comment.findByIdAndUpdate(req.params.cid, comment);
        res.redirect(`/book/bookdetails/${req.params.id}`);
    }catch(e){
        console.log(e);
      
    }
};

exports.delete =  (req, res) => {
    Comment.findByIdAndRemove(req.params.cid, (err, comment) => {
        if (err && comment == null) {
            return res.redirect(`/book/bookdetails/${req.params.id}`);
        } else {
            res.redirect(`/book/bookdetails/${req.params.id}`);
        }
    });
};
