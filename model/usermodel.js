

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const JWt = require('jsonwebtoken')




const userSchema = mongoose.Schema({
   name: { 
         type: String,
         required: true
     },
    email: {
             type: String,
             required: true
     },
    
    image: {
             type: String,
             required: true
     },
    
    password: {
             type: String,
             required: true
     },
    
     is_online: {
             type: String,
             default:"0"
         }
}, { timestamp: true });



// // function 
// userSchema.pre('save', async function (next) {
//     //for upadte user prevent double encryption
//     if (!this.isModified('password')) return next()
//     this.password = await bcrypt.hash(this.password, 10);

// });
// //compare password user for login
// userSchema.methods.comparePassword = async function (plainPassword) {
//     return await bcrypt.compare(plainPassword, this.password);
// };

// //token generate  userId for user identity
// userSchema.methods.generateToken = function () {
//     return JWt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
// }


module.exports = mongoose.model('User',userSchema )
