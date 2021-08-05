import React, {useContext, useState} from 'react';
import {useMutation, gql} from '@apollo/client';
import { Redirect } from 'react-router';
import { useForm } from '../../utils/hooks'
import { Form , Button} from 'semantic-ui-react';
import './Login.css'
import {AuthContext} from '../../context/auth'

const Login = props =>{ 
    const context = useContext(AuthContext)
    const [error , setError] = useState({})
    const { onChange, onSubmit , values} = useForm(loginUser, {
        username : '',
        password :'',
    })
   
    const [login, {loading}] = useMutation(LOGIN_USER, {
        update(_, result){
            console.log(result)
            context.login(result.data.login)
            props.history.push("/")
        },
        onError(err){
            setError(err.graphQLErrors[0]?.extensions.exception.errors);   
        },
        variables : values
        
    })
    
    function loginUser(){
        login()
    }
    
    return (
        <div className="Login">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                <h1>Login</h1>
                <Form.Input
                    label='Username'
                    placeholder='Username..'
                    name="username"
                    value={values.username}
                    error={error.username ? true : false}
                    onChange={onChange}>

                </Form.Input>
                <Form.Input
                    label='Password'
                    placeholder='Password..'
                    name="password"
                    value={values.password}
                    error={error.password ? true : false}
                    type="password"
                    onChange={onChange}>

                </Form.Input>
                <Button type="submit" primary>Login</Button>
            </Form>

            {Object.keys(error).length ?
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(error).map(value => {
                            return <li key={value}>{value}</li>
                        })}
                    </ul>
                </div>
                :
                null
            }
        </div>
    )
}

const LOGIN_USER= gql`
mutation login(
    $username : String!,
    $password : String!
){
    login(
        username : $username,
        password : $password,
    ){
        id email username createdAt token
    }
}`


export default Login;