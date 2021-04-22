import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import LoginForm from './LoginForm'
import { withAuth } from '@okta/okta-react'

import styled from 'styled-components'

import backgroundasset from '../../assets/purple.svg'

const Container = styled.div`
  text-align: center;
  padding: 60px;

  background-image: url(${backgroundasset});
  height: 100vh;
`

const TextContainer = styled.div`
  padding: 40px;
  margin: 0 auto;
  background: white;
  border: 2px solid #2b2b2b;
  height: fit-content;
  width: 400px;
`

export default withAuth(class Login extends Component {
  constructor (props) {
    super(props)
    this.state = { authenticated: null }
    this.checkAuthentication = this.checkAuthentication.bind(this)
    this.checkAuthentication()
  }

  componentDidUpdate () {
    this.checkAuthentication()
  }

  async checkAuthentication () {
    const authenticated = await this.props.auth.isAuthenticated()
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated })
    }
  }

  render () {
    if (this.state.authenticated === null) return null
    return this.state.authenticated
      ? <Redirect to={{ pathname: '/' }} />
      : (
        <Container>
          <TextContainer>
            <LoginForm baseUrl={this.props.baseUrl} />
          </TextContainer>
        </Container>
        )
  }
})
