const mongoose = require('mongoose')




const reportSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    user_id: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})




module.exports = mongoose.model('userReport', reportSchema)