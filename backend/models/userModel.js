const mongoose  = require("mongoose")

const userSchema = mongoose.Schema({
    name: {
        type: String,
        requried: [true, "Please add a name"]
    },
    email: {
        type: String,
        requried: [true, "Please add an email"],
        unique: true
    },
    password: {
        type: String,
        requried: [true, "Please add a password"]
    }
},
{
    timestamp: true
})

module.export = mongoose.model("User", userSchema)