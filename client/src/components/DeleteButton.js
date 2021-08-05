import React, {useState} from 'react';
import {gql, useMutation} from '@apollo/client';
import { Button, Icon, Confirm} from 'semantic-ui-react';

const DeleteButton = ({postId, callback}) => {
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [ deletePost] = useMutation(DELETE_POST_MUTATION, {
        update(){
            setConfirmOpen(false)
            // TODO remove post from cache
            console.log("INSIDE DELETE UPDATE")
            if(callback){
                callback();
            }

        },
        variables : {
            postId 
        }
    })
    return (
        <>
            <Button color='red' floated="right" clearing segment size="tiny" basic onClick={()=>setConfirmOpen(true)}>
                <Icon name='trash' />
            </Button>
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePost}
            />
        </>
    )
}

const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId : ID!){
        deletePost(postId : $postId)
    }
`
export default DeleteButton