import React, {useState, useContext} from 'react';
import {useMutation, gql} from '@apollo/client';
import { Form , Button} from 'semantic-ui-react'
import {useForm} from '../../utils/hooks'
import {AuthContext } from '../../context/auth'
import './Register.css';

const Register = props =>{
    const context = useContext(AuthContext)
    const [error , setError] = useState({})
    const { onChange, onSubmit , values} = useForm(registerUser, {
        username : '',
        password :'',
        email : '',
        confirmPassword :''
    
    })
   
    const [addUser, {loading}] = useMutation(REGISTER_USER, {
        update(_, result){ 
            context.login(result.data.register)
            props.history.push("/")
        },
        onError(err){
            setError(err.graphQLErrors[0]?.extensions.exception.errors);   
        },
        variables : values
        
    })
    
    function registerUser(){
        addUser()
    }
    
    return (
        <div className="Register">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                <h1>Register</h1>
                <Form.Input
                    label='Username'
                    placeholder='Username..'
                    name="username"
                    value={values.username}
                    error={error.username ? true : false}
                    onChange={onChange}>

                </Form.Input>
                <Form.Input
                    label='Email'
                    placeholder='Email..'
                    name="email"
                    value={values.email}
                    error={error.email ? true : false}
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
                <Form.Input
                    label='Confirm Password'
                    placeholder='Confirm Password ..'
                    name="confirmPassword"
                    value={values.confirmPassword}
                    error={error.confirmPassword ? true : false}
                    type="password"
                    onChange={onChange}>

                </Form.Input>
                
                <Button type="submit" primary>Register</Button>

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

const REGISTER_USER= gql`
mutation register(
    $username : String!,
    $email : String!,
    $password : String!,
    $confirmPassword : String!,
){
    register(registerInput : {
        username : $username,
        email : $email,
        password : $password,
        confirmPassword : $confirmPassword
    }){
        id email username createdAt token
    }
}`
export default Register;