const {Router}=require('express');
const {BlogModel}=require('../models/blogs.model');
const {UserModel}=require('../models/users.model');

const blogRouter=Router();


blogRouter.get("/",async (req,res)=>{
    console.log(req.query);
    if(req.query.category || req.query.author){
        const blogs=await BlogModel.find({$or: [{category:req.query.category},{author:req.query.author}] });
        res.send(blogs);
    }else{
        const blogs=await BlogModel.find();
    res.send(blogs);
    }
    
})

blogRouter.post("/create",async (req,res)=>{
    const {title,category,content,image}=req.body;
    const author_id=req.user_id;
    const user=await UserModel.findOne({_id:author_id});
    console.log(user);
    const new_blog=new BlogModel({
        title,
        category,
        author:user.name,
        content,
        image,
        author_email:user.email
    })
    await new_blog.save();
    res.send({msg:"blog Created"});
})


blogRouter.put("/edit/:blogId",async (req,res)=>{
    const blogID=req.params.blogId;
    const payload=req.body;
    
    const user_id=req.user_id
    const user=await UserModel.findOne({_id:user_id});
    const user_email=user.email;
    
    const blog=await BlogModel.findOne({_id:blogID});
    const author_email=blog.author_email;
    

    if(user_email!==author_email){
        res.send("Not authorised to edit this blog")
    }
    else{
        await BlogModel.findByIdAndUpdate(blogID,payload)
        res.send("Blog Updated");
    }
})



blogRouter.delete("/delete/:blogId",async (req,res)=>{
    const blogID=req.params.blogId;

    const user_id=req.user_id
    const user=await UserModel.findOne({_id:user_id});
    const user_email=user.email;
    
    const blog=await BlogModel.findOne({_id:blogID});
    const author_email=blog.author_email;
    

    if(user_email!==author_email){
        res.send("Not authorised to delete this blog")
    }
    else{
        await BlogModel.findByIdAndDelete(blogID)
        res.send("Blog deleted");
    }
})

module.exports={blogRouter};