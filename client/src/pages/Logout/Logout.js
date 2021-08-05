import React, {useEffect} from 'react'; 
import { Redirect, useHistory } from 'react-router-dom'

const Logout = props => {
    const history = useHistory()
    useEffect(() => {
        localStorage.removeItem('auth_token')
        history.push('/login')
    },[])
    return <Redirect to='/login'/>
}

export default Logout