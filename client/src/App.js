import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import {Container } from 'semantic-ui-react'
import './App.css';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home'
import NavBar from './components/NavBar';
import {AuthProvider}  from './context/auth'
import AuthRoute from './utils/AuthRoute'
import SinglePost from './pages/SinglePost'
const App = props => {

  return (
    <AuthProvider>
      <Router>
        <Container>
          <NavBar />
          <Route exact path='/' component={Home}/>
          <AuthRoute exact path='/login' component={Login}/>
          <AuthRoute exact path='/register' component={Register} />
          <Route exact path="/posts/:postId" component={SinglePost} />
        </Container>
      </Router>
    </AuthProvider>
  )
}

export default App;