import React, {useContext} from 'react'   
import { Card, Icon, Label, Image, Button} from 'semantic-ui-react'
import './Post.css';
import {Link} from 'react-router-dom';
import { useMutation, gql } from '@apollo/client'
import { AuthContext } from '../../context/auth'
import LikeButton from '../../components/LikeButton.js'
import moment from 'moment'
import DeleteButton from '../../components/DeleteButton'

const Post = (props) => {

    const { user } = useContext(AuthContext)
    
    const {
        id,
        username,
        body,
        createdAt,
        likeCount,
        commentCount,
        likes
    } = props.post

    const [ deletePost, { loading, error }] = useMutation(DELETE_POST,{
        variables : {postId : id},
        update(_, result){
            console.log(result)
        }
    })

  
    const commentPost = () => {
        console.log("COMMENT")
    }

    const onDeletePost = () => {
        deletePost()
        props.refreshPosts()
    }
    return (
        <Card fluid>
            <Card.Content>
            <Image floated='right' size='mini' src='https://react.semantic-ui.com/images/avatar/large/molly.png' />
            <Card.Header>{username}</Card.Header>
            <Card.Meta as={Link} to={`/posts/${id}`}>
                <span className='date'>{`Create on : ${moment(createdAt).fromNow()}`}</span>
            </Card.Meta>
            <Card.Description>
                {body}
            </Card.Description>
            </Card.Content>
            <Card.Content extra>
            <a>
            <LikeButton post={{id, likes,likeCount}} user={user}/>
            <Button as='div' labelPosition='right' as={Link} to={`/post/${id}`}>
                <Button color='blue' size="tiny" basic>
                    <Icon name='comments' />
                </Button>
                <Label as='a' basic color='blue' pointing='left'>
                    {commentCount}
                </Label>
            </Button>
            { user && username === user.username && <DeleteButton postId={id}/>}
            
            
            </a>
            </Card.Content>
        </Card>
    )
}

const DELETE_POST = gql`
mutation deletePost($postId : ID!){
    deletePost(postId : $postId)
}
`

export default Post;