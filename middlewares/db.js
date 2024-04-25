
var mongoose = require('mongoose');



const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`mongoose connect`)

    } catch (error) {
        console.log('mongoose errore')
    }
}


module.exports = {

   connectDb,
}
