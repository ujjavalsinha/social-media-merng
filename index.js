const {ApolloServer, PubSub} = require('apollo-server')

const mongoose = require('mongoose')

const { MONGODB } = require('./config.js')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const pubsub = new PubSub();
require("dotenv").config()
const server  = new ApolloServer({
    typeDefs,
    resolvers,
    context : ({req}) => ({req, pubsub})
});


mongoose.connect(MONGODB, { useNewUrlParser : true})
    .then(() => {
        console.log("Mongo DB Connected")
        return server.listen({port : process.env.PORT})
    })
    .then(res => {
        console.log(`Server running at ${res.url}`)
    })

//Apollo server uses Express behind the scenes to create server and create routes
