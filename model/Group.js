const mongoose = require('mongoose')




const groupSchema =  new mongoose.Schema({

    name: {
        type : String,
        required:true,
        min: 6,
        max :255
    },
    user_id :[String]
})




module.exports = mongoose.model('group', groupSchema)