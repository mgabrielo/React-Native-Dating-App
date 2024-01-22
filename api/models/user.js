const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "non-binary"] },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    description: {
        type: String,
    },
    crushes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    recievedLikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    matches: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    profileImages: [
        { type: String }
    ],
    turnOns: [
        {
            type: String   // user turn ons
        }
    ],
    lookingFor: [
        {
            type: String  // what the user is looking for
        }
    ],
})

const User = mongoose.model("User", userSchema)

module.exports = User