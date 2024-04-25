require('dotenv').config();

var mongoose = require('mongoose');



//mongoose.connect("mongodb+srv://mohitglobal67:mohit@sbs.jjk73yj.mongodb.net/test");

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URL, {   useNewUrlParser: true,
  useUnifiedTopology: true, },);

mongoose.connection.on('err', err => {
    console.log("connection failed");
});

mongoose.connection.on('connected', connected => {
    console.log("connection Success ");
})

const app = require('express')();

const http = require('http').Server(app);

const User = require('./model/usermodel')

const Chat = require('./model/chatmodel')

const userRoutes = require("./routes/userRoutes");

app.set('view engine', 'ejs');

app.use('/', userRoutes);


const io = require('socket.io')(http);


var usp = io.of('/user-namespace');

usp.on('connection',async function (socket) {

    const userId = socket.handshake.auth.token;

      const username1 = socket.handshake.query.auth
    
     console.log(userId);
     console.log(username1);

    
    await User.findByIdAndUpdate({ _id: userId || username1 }, { $set: { is_online: '1' } });


    //show online user broadcast
    socket.broadcast.emit('getOnlineUser', {user_id:userId || username1})

        console.log("user connected");


    socket.on('disconnect',async function () {

        var userId = socket.handshake.auth.token;
        const username1 = socket.handshake.query.auth
        await User.findByIdAndUpdate({ _id: userId || username1}, { $set: { is_online: '0' } });

            //show offline user broadcast
       socket.broadcast.emit('getOfflineUser', {user_id:userId || username1})
        
        console.log("user disconnected");
        
    });

    //chat implemation
    socket.on('newChat', function (data) {

        

        socket.broadcast.emit('loadNewChat', data);
            
    });


     socket.on('existsChat',async function (data) {

         var chats = await Chat.find({
             $or: [{
                 sender_id: data.sender_id,
                 receiver_id: data.receiver_id
             },
                 
             {
                 sender_id: data.receiver_id,
                 receiver_id: data.sender_id
             }
             ]
         });
         socket.emit('loadChats',{chats:chats})
        
    
    });
})




const PORT = 3000;
// app.use('/', (req, res) => {

//     res.render('register');
// });

http.listen(PORT,'192.168.1.113', function() {
    console.log(`server is runing `);
})