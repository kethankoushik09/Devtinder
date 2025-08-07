const mongoose = require("mongoose");


const connectDB = async()=>{
    
    await mongoose.connect("mongodb+srv://kethankoushik09:QVNSQw9t3WUtu3Zf@gaikwad.lp473uh.mongodb.net/Devtinder")
}




module.exports = {connectDB};