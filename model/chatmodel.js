
const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({


    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        
        
        ref:"User"
    },

     receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        
        ref:"User"
    },
     
    message: {
        type: String,
        required: true
    },
    timestamp: { type: String, default: getCurrentTime }

    
 
},


);

function getCurrentTime() {
  const now = new Date();
  const options = { hour: 'numeric', minute: '2-digit', hour12: true };
  return now.toLocaleTimeString('en-US', options);
}



module.exports = mongoose.model('Chat',chatSchema )