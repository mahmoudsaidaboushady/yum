const mongoose = require('mongoose');
const app = require('./app');

const port = 5000;
app.listen(port , ()=>{
    console.log(`App running on port ${port}....`);
})

const DB = 'mongodb+srv://mahmoudsaidaboushady:WIH3Q3kUvRlj43eI@yum.lsnyjqv.mongodb.net'

mongoose.connect(DB)
.then(() => {
    console.log('DB connection Successful');
}); 
