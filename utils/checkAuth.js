const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const { SECRET_KEY } = require('../config')

module.exports = async (context) => {
    console.log("CONTEXT : ",context)
    const authHeader = context.req.headers.authorization
    if(authHeader){
        const token = authHeader.split('Bearer ')[1]
        console.log("TOKEN : ",token)
        if(token){
            try{
                const user = await jwt.verify(token, SECRET_KEY)
                return user
            }
            catch(error){
                throw new AuthenticationError("Invalid/Expired token")
            }
        
        }
        throw new Error("Authentication token should be valid")
    }
    throw new Error("Authorization header is not provided")
}