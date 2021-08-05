import {gql} from '@apollo/client';

export const FETCH_POSTS_QUERY = gql`
{
    getPosts{
        id
        body
        createdAt
        username
        likeCount
        likes{
            username

        }
        commentCount
        comments{
            body
        }
    }
}`

export const DELETE_POST = gql`
mutation deletePost($postId : ID!){
    deletePost(postId : $postId)
}
`