import gql from 'graphql-tag';
import React, {useContext} from 'react';
import {useQuery} from '@apollo/client'
import { Card, Grid, Image, Button, Icon, Label } from 'semantic-ui-react';
import moment from 'moment'
import LikeButton from '../components/LikeButton';
import {AuthContext} from '../context/auth'
import DeleteButton from '../components/DeleteButton'

const SinglePost = props => {
    const postId = props.match.params.postId
    
    const user = useContext(AuthContext)
    console.log(postId)
    const { data } = useQuery(FETCH_POST_QUERY, {
        variables : {
            postId
        }
    })
    let postMarkup;
    if(!data){
        postMarkup = <p>Loading</p>
    }else{
        const {
            id, body, createdAt, username, comments, likes, likeCount, commentCount 
        } = data.getPost;
    console.log(user.user.username, username)

    const deletePostCallback = () => {
        props.history.push('/')
   }

        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                    <Image floated='right' size='small' src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                            </Card.Content>
                            <hr/>
                            <Card.Content extra>
                                <LikeButton user={user} post={{id, likeCount, likes}}/>
                                <Button 
                                    as="div"
                                    labelPositon="right"
                                    onClick={() => console.log("Comment on Post")}
                                    >
                                        <Button basic color="blue">
                                            <Icon name="comments"/>
                                        </Button>
                                        <Label basic color="blue" pointing="left">
                                            {commentCount}
                                        </Label>
                                    </Button>
                                    {user && user.user.username === username && <DeleteButton callback={deletePostCallback} postId={postId}/>}
                            </Card.Content>
                        </Card>
                    </Grid.Column>

                </Grid.Row>
            </Grid>
        )
    }

    return postMarkup

}

const FETCH_POST_QUERY = gql`
    query($postId : ID!){
        getPost(postId : $postId){
            id
            body
            createdAt
            username
            likes{
                username
            }
            commentCount
            comments{
                id
                createdAt
                body
            }
        }
    }
`
export default SinglePost