import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import { SecureRoute, ImplicitCallback } from '@okta/okta-react'

import Navigation from './components/shared/Navigation'
import HomePage from './components/home/HomePage'
import AdminPage from './components/auth/AdminPage'
import RegistrationPage from './components/auth/RegistrationPage'
import config from './app.config'
import LoginPage from './components/auth/LoginPage'
import ProfilePage from './components/auth/ProfilePage'

import styled from 'styled-components'
import 'antd/dist/antd.css' // or 'antd/dist/antd.less'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`

export default class App extends Component {
  render () {
    return (
      <Container>
        <Navigation />
        <main>
          <Route path="/" exact component={HomePage} />
          <Route
            path="/login"
            render={() => <LoginPage baseUrl={config.url} />}
          />
          <Route path="/implicit/callback" component={ImplicitCallback} />
          <Route path="/register" component={RegistrationPage} />
          <SecureRoute path="/profile" component={ProfilePage} />
          <SecureRoute path="/admin" component={AdminPage} />
        </main>
      </Container>
    )
  }
}
