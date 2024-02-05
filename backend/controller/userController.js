import asyncHandler from 'express-async-handler'
import User from '../model/userModel.js'
import generateToken from '../utils/generateToken.js'

//@desc auth User/set token
//route POST /api/users/auth
//@access Public

const authUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    const user = await User.findOne({email})

    if(user && (await user.matchPassword(password))){
        generateToken(res, user)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email:user.email
        })
    }else{
        res.status(400);
        throw new Error('Invalid email or password')
    }

})

//@desc Register new User
//route POST /api/users
//@access Public

const registerUser = asyncHandler(async (req, res) => {
    
    const {name, email, password} = req.body
    console.log(name, email, password);

    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400);
        throw new Error('User Already Exists')
    }

    //Creating User
    const user = await User.create({
        name,
        email,
        password
    })

    if(user){
        generateToken(res, user)
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email:user.email
        })
    }else{
        res.status(400);
        throw new Error('Invalid Credentials')
    }

})

//@desc Logout User
//route POST /api/users/logout
//@access Public

const logoutUser = asyncHandler(async (req, res) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    })
    
    res.status(200).json({message: " User Logged out "})
})

//@desc Get Profile info
//route GET /api/users/profile
//@access Private

const getUser = asyncHandler(async (req, res) => {
const user = {
    _id: req.user._id,
    name: req.user.name,
    email:req.user.email
}

    res.status(200).json(user)
})

//@desc Update User
//route pUT /api/users/profile
//@access Private

const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if(req.body.password){
            user.password = req.body.password || user.password
        }

        const updatedUser = await user.save()
        res.status(201).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        })
    }else{
        res.status(404)
        throw new Error('User not found')
    }
})

export {
    authUser,
    registerUser,
    logoutUser,
    getUser,
    updateUser
}