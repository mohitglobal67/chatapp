
const User = require('../model/usermodel');
const bcrypt = require('bcrypt');
const Chat = require('../model/chatmodel')

const registerLoad = async (req, res)=>{
    try {
        res.render('register')
    } catch (error) {
        res.render('register')
    }
    
}
const register = async (req, res) => {
    
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 10)
        
        const user = new User({
        name: req.body.name,
        email: req.body.email,
        image: 'images/'+req.file.filename,
        password: passwordHash
        });
        
    await user.save();
res.render('register', { message: 'Your Registration has beend Completed!' })
        
    } catch (error) {
        console.log(error);
    }
}



const loginLoad = async (req, res)=>{
    try {
        res.render('login')
    } catch (error) {
        
  
    }
    
}
const login = async (req, res) => {
    
    try {

const email = req.body.email;
const password = req.body.password;
const userData = await User.findOne({ email: email });
        if (userData) {
    
            const passwordMatch =await bcrypt.compare (password, userData.password);
    if (passwordMatch){
        req.session.user = userData;
        
        res.redirect('/dashboard')
    }
    else{
    res.render('login', { message: 'Email and Password is Incorrect!' })
      }
   }
else{
res.render('login',{message:"Email and password is incorrect"});
}
   
    } catch (error) {
        console.log(error);
    }
}


const logout = async (req, res)=>{
    try {
        req.session.destroy();
         res.redirect('/')
    } catch (error) {
        //res.render('login')
    }    
}

const loadDashboard = async (req, res)=>{
    try {


        var users = await User.find({ _id: { $nin: [req.session.user._id] } });

          res.render('dashboard',{user:req.session.user, users:users})
      
    } catch (error) {
        
  
    }
    
}


const saveChat = async (req, res) => {
    
    try {

        var chat = Chat({
            sender_id: req.body.sender_id,
            receiver_id: req.body.receiver_id,
            message:req.body.message,
        })
      var newChat =  await chat.save();
        res.status(200).send({success:true,message:"Chat inserted succesfully", data:newChat})
        
    } catch (error) {

        res.status(400).send({success:false,message:error.message})
        
    }
}

module.exports = {
registerLoad,
    register,
    loginLoad,
    login,
    logout,
    loadDashboard,
    saveChat
}