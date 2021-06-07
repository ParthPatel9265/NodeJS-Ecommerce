
const mongoose = require('mongoose');

module.exports =  function(MONGODB_URI){
    
mongoose
.connect(
  MONGODB_URI,{ useNewUrlParser: true }
)
.then(result => {
  
  console.log('MongoDB connected');
})
.catch(err => {
  console.log(err);
});
        
};