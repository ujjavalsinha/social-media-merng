const User = require('../../models/User')
const { SECRET_KEY} = require('../../config')
const { UserInputError } = require('apollo-server')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { validateRegisterInput } = require('../../utils/validators')
const { validateLoginInput } = require('../../utils/validators')

function generateToken(user){
    return jwt.sign({
        id : user.id,
        email : user.email,
        username : user.username
    },
    SECRET_KEY,
    {expiresIn : '1h'})
}

module.exports = {
    Mutation : { 
        login : async (_ , { username, password}) => {
            const {errors, valid} = validateLoginInput(username,password)
            if(!valid){
                throw new UserInputError("Errors", {errors})
            }
            const user = await User.findOne({username : username})
            if(!user){
                errors.general = "User not found"
                throw new UserInputError("User not found", { errors })
            }
            const match = await bcrypt.compare(password, user.password);
            if(!match){
                errors.general = "User not found"
                throw new UserInputError("Wrong Credentials", { errors})
            }
            const token = generateToken(user)
            return {
                ...user._doc,
                id : user.id,
                token
            }
        },
        async register(_, 
            {registerInput : {username, email, password, confirmPassword}},
            ){
                const { valid, errors} = validateRegisterInput(username, email, password, confirmPassword)
                if(!valid){
                    throw new UserInputError("Errors", {errors})
                }
                const user = await User.findOne({ username })
                if(user){
                    console.log("USERNAME : ",user)
                    throw new UserInputError('Username already taken',{
                        errors : {
                            username : "This username is already taken"  //this error obj will be used on the client side of Apollo
                        }
                    }
                   )
                }

                password = await bcrypt.hash(password, 12);

                const newUser = new User({
                    email : email,
                    username : username,
                    password : password,
                    createdAt : new Date().toISOString()
                })

                const result = await newUser.save()
                const token = generateToken(result)

                return {
                    ...result._doc,
                    id : result._id,
                    token 
                }
          
        }
    }
}

//args : arguments
//Parent : input from last step
//If data comes from one resolver to another
//context : 
//info : meta data info