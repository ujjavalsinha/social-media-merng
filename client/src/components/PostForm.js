import { Form, FormInput, Button } from 'semantic-ui-react';
import React from 'react';
import { useForm } from '../utils/hooks'
import {FETCH_POSTS_QUERY} from '../utils/graphql'
import {gql, useMutation} from '@apollo/client'

const PostForm = props => {
    const { values, onChange, onSubmit} = useForm(createPostCallBack,{
        body : ''
    })

    const [ createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
        variables : values,
        update(proxy, result){
            const data = proxy.readQuery({
                query : FETCH_POSTS_QUERY
            })
            data.getPosts = [result.data.createPost, ...data.getPosts]
            proxy.writeQuery({query : FETCH_POSTS_QUERY, data})
            console.log(result)
            values.body = ''
        },
        onError(err){
            console.log(err)
        }
    })

    async function createPostCallBack(){
        createPost()
        
    }

    return (
        <>
        <Form onSubmit={onSubmit}>
            <h2> Create a Post: </h2>
            <Form.Field>
                <FormInput 
                    placeholder="Hi World"
                    name="body"
                    onChange={onChange}
                    value={values.body}
                    error={error ? true : false}
                    />
                    <Button type="submit" color="teal">Submit</Button>
            </Form.Field>
        </Form>
        {error && (
            <div className="ui error message" style={{marginBottom : 20}}>
                <ul className='list'>
                    <li>{error.graphQLErrors[0].message}</li>
                </ul>
            </div>
        )}
        </>
    )
}

export default PostForm
const CREATE_POST_MUTATION = gql`
mutation createPost($body : String!){
    createPost(body : $body){
        id body createdAt username
        likes {
            id username createdAt
        }
        likeCount
        comments {
            id body createdAt
        }
        commentCount
    }
}
`