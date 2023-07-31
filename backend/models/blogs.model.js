const mongoose=require('mongoose');

const blogSchema=new mongoose.Schema({
    title:{type:String, required:true},
    category:{type:String, required:true},
    author:String,
    content:String,
    image:String,
    author_email:String
},{
    timestamps:true,
})

const BlogModel=mongoose.model("blogs", blogSchema);


module.exports={BlogModel};