var mongoose = require('mongoose');

//Define Shema to store chat historical
var chatSchema = mongoose.Schema({
    meId: String,
    whoId: String,
    sDate: Date,
    message: String
});

module.exports = mongoose.model('Chat', chatSchema);