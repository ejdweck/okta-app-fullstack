import React from 'react'
import { Link } from 'react-router-dom'
import { withAuth } from '@okta/okta-react'

import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  background: white;
`

const StyledLink = styled(Link)`
  font-size: 18px;
  padding: 20px;
`

const NavContainer = styled.div`
  display: flex; 
`

export default withAuth(
  class Navigation extends React.Component {
    constructor (props) {
      super(props)
      this.state = { authenticated: null, isAdmin: null }
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
      const { authenticated, isAdmin } = this.state
      // if (authenticated === null) return null
      const authNav = authenticated
        ? (
          <NavContainer>
            <StyledLink onClick={() => this.props.auth.logout()}>
              Logout
            </StyledLink>
            <StyledLink to="/profile">User Profile</StyledLink>
            <StyledLink to="/admin">Admin</StyledLink>
          </NavContainer>
          )
        : (
          <NavContainer>
            <StyledLink onClick={() => this.props.auth.login()}>
              Login
            </StyledLink>
            <StyledLink to="/register">Register</StyledLink>
          </NavContainer>
          )
      return (
        <Container>
          <StyledLink to="/">Home</StyledLink>
          {authNav}
        </Container>
      )
    }
  },
)
