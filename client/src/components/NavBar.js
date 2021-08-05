import React, { useContext, useState } from 'react'
import { Menu, Segment } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { AuthContext} from '../context/auth'
const NavBar = props => { 
    const { user, logout} = useContext(AuthContext);
    const handleItemClick = (e, { name }) => setActiveItem(name)
    const pathname = window.location.pathname;
    const path = pathname === '/' ? 'home' : pathname.substr(1);
    const [ activeItem, setActiveItem] = useState(path)
    const menuBar = !user ? 
    (
        <div>
            <Menu pointing secondary color='teal' size="massive">
                <Menu.Item
                name='home'
                active={activeItem === 'home'}
                onClick={handleItemClick}
                as={Link}
                to="/"
                />
                <Menu.Menu position='right'>
                
                <Menu.Item
                    name='login'
                    active={activeItem === 'login'}
                    onClick={handleItemClick}
                    as={Link}
                    to='/login'
                />
                <Menu.Item
                    name='register'
                    active={activeItem === 'register'}
                    onClick={handleItemClick}
                    as={Link}
                    to='/register'
                />
                
               
                </Menu.Menu>
            </Menu>
        </div>
    ) : 
    (
        <div>
            <Menu pointing secondary color='teal' size="massive">
                <Menu.Item
                name={user.username}
                active
                as={Link}
                to="/"
                />
                <Menu.Menu position='right'>
                
                <Menu.Item
                    name='logout'
                    onClick={logout}
                    as={Link}
                    to='/login'
                />
               
                </Menu.Menu>
            </Menu>
        </div>
    )
    
    return menuBar;
}

export default NavBar;