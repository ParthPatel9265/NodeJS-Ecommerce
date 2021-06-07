module.exports =  async function(req, res, next){
    if(req.isAuthenticated()){
         const user = req.user;
         if(user.role==='admin'){
             next();
         }else{
              res.redirect('/');
         }
    }else{
        res.redirect('/user/login');
    }
};