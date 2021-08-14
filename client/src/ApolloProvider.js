import React from 'react';
import App from './App';
import {ApolloClient, ApolloLink, HttpLink} from '@apollo/client';
import { InMemoryCache } from 'apollo-cache-inmemory';
// import {HttpLink} from 'apollo-link-http';
import {ApolloProvider} from "@apollo/client";

const httpLink = new HttpLink({
    uri : 'https://social-media-react-merng.herokuapp.com/graphql'
})

const authLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem('jwtToken');
    
    operation.setContext({
        headers : {
            Authorization : token ? `Bearer ${token}` : ''
        }
    });
    return forward(operation)
})

const client = new ApolloClient({
    link : authLink.concat(httpLink),
    cache : new InMemoryCache()
})

export default (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
)
