import React, {useState, useEffect, useContext} from 'react';
import {useLazyQuery, gql} from '@apollo/client';
import { Grid, Image, Transition } from 'semantic-ui-react'
import Post from '../Post/Post'
import {FETCH_POSTS_QUERY} from '../../utils/graphql'
import {AuthContext} from '../../context/auth'
import './Home.css'
import PostForm from '../../components/PostForm'

const Home = props =>{ 
    const { user } = useContext(AuthContext)
    // const {loading, data : { getPosts : posts }} = useQuery(FETCH_POSTS_QUERY);
    const [fetchPostData, { loading, data }] = useLazyQuery(FETCH_POSTS_QUERY, {fetchPolicy: 'network-only'});
    
    useEffect(() => {
        console.log("FETCHING POSTS")
        fetchPostData();
        console.log("FETCHED POSTS")
    },[])

    return (
        <div className='Home'>
           <Grid columns='three' divided>
               <Grid.Row className='page-title'> 
                   <h1>Recent Posts</h1>
               </Grid.Row>
                <Grid.Row>
                    { user  && (
                        <Grid.Column>
                            <PostForm refreshPosts={fetchPostData}/>
                        </Grid.Column>
                    )}
                    {loading ? (
                        <h1>Loading ... </h1>
                    ):
                    (
                        <Transition.Group>
                        {data && data.getPosts.map(post => (
                             <Grid.Column style={{marginBottom : '20px'}} key={post.id}>
                                 <Post refreshPosts={fetchPostData} post={post} />
                             </Grid.Column>
                        ))}
                        </Transition.Group>
                    )}
                
                </Grid.Row>
            </Grid>
        </div>
    )
}


export default Home;