
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



 const loginApi = async (req, res) => {

    try {
        const { email, password } = req.body;
        //Validation

        if (!email || !password) {
            return res.status(500).send({

                success: false,
                message: "Please add Email & Password"

            })
        }

        //check user email 

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).send({
                success: false,
                message: "User not found Please Register"
            })
        }

        // check Password

        const isMatch = await user.comparePassword(password);

        //validation password

        if (!isMatch) {

            return res.status(500).send({

                success: false,
                message: "Invalid credentials"
            })
        }

        //Token pass 

        const token = user.generateToken();
        res.status(200).send({
            seccess: true,
            message: "Login Succesfully",
            token,
            user
          
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login Api",
            error
        })
    }

}



///Get all user
const getAllUser = async (req, res) => {

    try {

                const alluser = await User.find();
      

            res.status(200).send({ seccess: true, msg: "User details", alluser })


    } catch (error) {

        console.log(error);

        res.status(500).send({
            success: false,
            message: "Error in Getall Products",
            error
        })

    }


}


//get all chat 

const getAllChat = async (req, res) => {

    try {

                const allchat = await Chat.find();
      

            res.status(200).send({ seccess: true, msg: "User details", allchat })


    } catch (error) {

        console.log(error);

        res.status(500).send({
            success: false,
            message: "Error in Getall Products",
            error
        })

    }


}




// const getChatById = async (req, res) => {
//     try {s
//         const params = req.query; // Extract parameters from the request object

//         const allchat = await Chat.find(params); // Use Mongoose to find chats based on the parameters

//         res.status(200).json({ success: true, message: "Chat details", allchat });
//     } catch (error) {
//         console.error('Error fetching chats:', error);
//         res.status(500).json({ success: false, message: "Error in fetching chats", error });
//     }
// };

const getChatById = async (req, res) => {
    try {
       

         const senderId =  req.query.sender_id ;
        const receiverId = req.query.receiver_id;
        

        const allchat = await Chat.find({ $or: [
        { sender_id: senderId, receiver_id: receiverId },
        { sender_id: receiverId, receiver_id: senderId }
      ]  }); // Use Mongoose to find chats based on the parameters
        res.status(200).json({ success: true, message: "Chat details", allchat, length:allchat.length });
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ success: false, message: "Error in fetching chats", error });
    }
};
module.exports = {
registerLoad,
    register,
    loginLoad,
    login,
    logout,
    loadDashboard,
    saveChat,
    loginApi,
    getAllUser,
    getAllChat,
    getChatById
}