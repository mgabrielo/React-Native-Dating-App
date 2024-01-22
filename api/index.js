require("dotenv").config()
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const crypto = require("crypto")
const nodeMailer = require("nodemailer")

const app = express()
const port = 3000
const cors = require('cors')

app.use(cors())
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const jwt = require("jsonwebtoken")
const User = require("./models/user")
const Chat = require("./models/message")
mongoose.connect(`${process.env.MONGODB_URI}`).then(() => {
    console.log('Connected to MongoDB')
}).catch((err) => {
    console.log('Err connecting to mongodb', err)
})

app.listen(port, () => {
    console.log("server running on " + port)
})

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) return res.status(400).json({ message: 'user already exist' })
        const newUser = new User({ name, email, password })
        newUser.verificationToken = crypto.randomBytes(20).toString("hex")
        await newUser.save()
        sendVerificationEmail(newUser.email, newUser.verificationToken)
        res.status(201).json({ message: 'Registration Successful', user: newUser })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Registration Failed' })
    }
})


const sendVerificationEmail = async (email, verificationToken) => {
    const transporter = nodeMailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.NODE_MAILER_APP_EMAIL,
            pass: process.env.NODE_MAILER_APP_PASSWORD
        }
    })
    const mailOptions = {
        from: "matchmake@email.com",
        to: email,
        subject: 'Email Verification',
        text: `please click the following link to verify your email: http://localhost:3000/verify/${verificationToken}`
    }
    try {
        await transporter.sendMail(mailOptions)
        console.log('Verification Email Sent')
    } catch (error) {
        console.log('error sending verifcation email')
    }
}

app.get('/verify/:token', async (req, res) => {
    try {
        const token = req.params.token

        const user = await User.findOne({ verificationToken: token })
        if (!user) {
            return res.status(404).json({ message: 'Invalid Token' })
        }

        user.verified = true
        user.verificationToken = undefined

        await user.save()
        return res.status(200).json({ message: 'Email Verification Successful' })
    } catch (error) {
        return res.status(500).json({ message: 'Email verfication unsucessful' })
    }

})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (!existingUser) return res.status(401).json({ message: 'Invalid credentials' })

        if (existingUser.password !== password) {
            return res.status(401).json({ message: 'Invalid Credentials' })
        }
        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
        res.status(200).json({ token: token })
    } catch (error) {
        return res.status(500).json({ message: 'Login Failed' })
    }
})

app.put('/users/:userId/gender', async (req, res) => {
    try {
        const userId = req.params.userId
        const { gender } = req.body
        const user = await User.findByIdAndUpdate(userId, { gender: gender }, { new: true })
        if (!user) return res.status(404).json({ message: 'User Not Found' })
        res.status(200).json({ message: 'Gender Updated Successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Err updating user identity', error: error })
    }
})

app.put('/users/:userId/description', async (req, res) => {
    try {
        const { userId } = req.params
        const { description } = req.body
        const user = await User.findByIdAndUpdate(userId, { description: description }, { new: true })
        if (!user) return res.status(404).json({ message: 'User Not Found' })
        res.status(200).json({ message: 'Description Updated Successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Err updating user identity', error: error })
    }
})

app.get('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: 'User Not Found' })
        return res.status(200).json({ user: user })
    } catch (error) {
        res.status(500).json({ message: 'Err updating user identity', error: error })
    }
})

app.put("/users/:userId/turn-ons/add", async (req, res) => {
    try {
        const { userId } = req.params
        const { turnOn } = req.body
        const user = await User.findByIdAndUpdate(userId, { $addToSet: { turnOns: turnOn } }, { new: true })
        if (!user) return res.status(404).json({ message: 'User Not Found' })
        return res.status(200).json({ message: 'Turn On Updated Successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Err updating user identity', error: error })
    }
})

app.put("/users/:userId/turn-ons/remove", async (req, res) => {
    try {
        const { userId } = req.params
        const { turnOn } = req.body
        const user = await User.findByIdAndUpdate(userId, { $pull: { turnOns: turnOn } }, { new: true })
        if (!user) return res.status(404).json({ message: 'User Not Found' })
        return res.status(200).json({ message: 'Turn On Removed Successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Err updating user identity', error: error })
    }
})

app.put('/users/:userId/looking-for/add', async (req, res) => {
    try {
        const { userId } = req.params
        const { lookingFor } = req.body
        const user = await User.findByIdAndUpdate(userId, { $addToSet: { lookingFor: lookingFor } }, { new: true })
        if (!user) return res.status(404).json({ message: 'User Not Found' })
        return res.status(200).json({ message: 'Looking For Updated Successful', user: user })
    } catch (error) {
        res.status(500).json({ message: 'Err updating user identity', error: error })
    }
})

app.put('/users/:userId/looking-for/remove', async (req, res) => {
    try {
        const { userId } = req.params
        const { lookingFor } = req.body
        const user = await User.findByIdAndUpdate(userId, { $pull: { lookingFor: lookingFor } }, { new: true })
        if (!user) return res.status(404).json({ message: 'User Not Found' })
        return res.status(200).json({ message: 'Looking For Updated Successful', user: user })
    } catch (error) {
        res.status(500).json({ message: 'Err updating user identity', error: error })
    }
})

app.post("/users/:userId/profile-images", async (req, res) => {
    try {
        const { userId } = req.params
        const { imageUrl } = req.body
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: 'User Not Found' })
        user.profileImages.push(imageUrl)
        await user.save()
        return res.status(200).json({ message: 'Image Added Successful', user: user })
    } catch (error) {
        res.status(500).json({ message: 'Err updating user identity', error: error })
    }
})

// fetch all users
app.get("/get-profiles", async (req, res) => {

    try {
        let filter = {}
        const { userId, gender, turnOns, lookingFor } = req.query
        if (userId && gender && turnOns && lookingFor) {
            filter = { gender: gender === "male" ? "female" : "male" }
            filter.turnOns = { $in: turnOns }
            filter.lookingFor = { $in: lookingFor }
        }
        const currentUser = await User.findById(userId).populate("matches", "_id").populate("crushes", "_id")
        // extract userid for matches

        const friendIds = currentUser.matches.map((friend) => friend._id)
        const crushIds = currentUser.crushes.map((crush) => crush._id)
        const profiles = await User.find(filter).where("_id").nin([userId, ...friendIds, ...crushIds])
        console.log(profiles)
        return res.status(200).json({ profiles: profiles })
    } catch (error) {
        res.status(500).json({ message: 'Err updating user profile', error: error })
    }
})


app.post('/send-like', async (req, res) => {
    try {
        const { currentUserId, selectedUserId } = req.body
        // update received likes
        await User.findByIdAndUpdate(selectedUserId, { $push: { recievedLikes: currentUserId } })
        // update user crushes
        await User.findByIdAndUpdate(currentUserId, { $push: { crushes: selectedUserId } })
        res.sendStatus(200)
    } catch (error) {
        res.status(500).json({ message: 'Err updating user profile', error: error })
    }
})

app.get('/received-likes/:userId/details', async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: 'User Not Found' })
        //fetch details of who liked current user
        const receivedLikesArray = []
        for (const likedUserId of user.recievedLikes) {
            const likedUser = await User.findById(likedUserId)
            if (likedUser) {
                receivedLikesArray.push(likedUser)
            }
        }
        res.status(200).json({ receivedLikesDetails: receivedLikesArray })
    } catch (error) {
        res.status(500).json({ message: 'Err matching user profile', error: error })
    }
})

// endpoint to create match between users
app.post('/create-match', async (req, res) => {
    try {
        const { currentUserId, selectedUserId } = req.body
        // update selected selected user array and matches array
        await User.findByIdAndUpdate(selectedUserId, {
            $push: {
                matches: currentUserId
            },
            $pull: {
                crushes: currentUserId
            }
        })

        // update current-users  matches array & received-likes array
        await User.findByIdAndUpdate(currentUserId, {
            $push: {
                matches: selectedUserId
            },
            $pull: {
                recievedLikes: selectedUserId
            }
        })

        return res.sendStatus(200)
    } catch (error) {
        res.status(500).json({ message: 'Err matching user profile', error: error })
    }
})


// endpoint to get all matches of a current user

app.get("/users/:userId/matches", async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({ message: 'User Not Found' })
        const matchIds = user.matches
        const matches = await User.find({ _id: { $in: matchIds } })
        return res.status(200).json({ matches: matches })
    } catch (error) {
        res.status(500).json({ message: 'Err matching user profile', error: error })
    }
})

io.on("connection", (socket) => {
    console.log('user connected')
    socket.on("sendMessage", async (data) => {
        try {
            const { senderId, receiverId, message } = data
            console.log('socket-data : ', data)
            const newMessage = new Chat({ senderId, receiverId, message })
            await newMessage.save()

            // emit message to receiever
            io.to(receiverId).emit("receiveMessage", newMessage)
        } catch (error) {
            console.log('err handling msg', error)
        }
        socket.on("disconnect", () => {
            console.log('user disconnected')
        })
    })
})

http.listen(8000, () => {
    console.log('socket.io server running on port 8000')
})

app.get("/messages", async (req, res) => {
    try {
        const { senderId, receiverId } = req.query
        const messages = await Chat.find({
            $or: [
                {
                    senderId: senderId,
                    receiverId: receiverId
                },
                {
                    senderId: receiverId,
                    receiverId: senderId
                }
            ]
        }).populate("senderId", "_id name")

        return res.status(200).json({ messages: messages })
    } catch (error) {
        res.status(500).json({ message: 'error handling messages', error })
    }
})


app.delete("/message/delete", async (req, res) => {
    try {
        const { messages } = req.body
        if (!Array.isArray(messages) || messages.length == 0) {
            return res.status(400).json({ message: 'Invalid Request' })
        }
        for (const message of messages) {
            await Chat.findByIdAndDelete({ _id: message._id })
        }
        return res.status(200).json({ message: 'Message Deleted' })
    } catch (error) {
        res.status(500).json({ message: 'error handling messages', error })
    }
})