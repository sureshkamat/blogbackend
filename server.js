const express=require('express');
const bcrypt=require('bcrypt');
const jwt=require("jsonwebtoken");
require("dotenv").config()
const cors = require("cors")

const {connection}=require('./utils/db.js')
const {UserModel}=require("./models/users.model.js")
const {blogRouter}=require('./routes/blogs.router.js')
 const {authentication}=require("./authenticator/authentication.js");

const app=express();
app.use(cors({
    origin : "*"
}))
app.use(express.json())


app.get("/",async (req,res)=>{
    const user=await UserModel.find();
    res.send(user);
})

app.post("/signup",async (req,res)=>{
    let {name,email,password}=req.body;
    bcrypt.hash(password,3,async function(err,hash){
        const user=new UserModel({
            name,
            email,
            password:hash
        });
        try{
            await user.save();
            res.send("SignUp Successfully");
        }
        catch(err){
            console.log(err);
            res.status(500).send("Something Went Wrong");
        }
    })
})

app.post("/login",async (req,res)=>{
    
    const {email,password}=req.body;
    const user=await UserModel.findOne({email});
    if(!user){
        res.send("Invalid Credentials Sign Up First");
    }
    else{
        const hashed_password=user.password;
        bcrypt.compare(password,hashed_password,function(err,result){
            if(result){
                    let token=jwt.sign({user_id:user._id},process.env.Secret_Key)
                    res.send({message:"login Successfull", token:token})
            }
            else{
                res.send("Invalid Credentials Login Failed");
            }
        })

    }
})


app.use("/blogs",authentication,blogRouter);


app.listen(5000,async ()=>{
        try{
            await connection;
            console.log('DBMS Connected');
        }
        catch(err){
            console.log(err);
        }
        console.log('Server is running on  5000');
})