import React from 'react'
import { Link } from 'react-router-dom'
import { withAuth } from '@okta/okta-react'

import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  background: yellow;
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

    async checkIsAdminUser () {
      const { auth } = this.props
      const { email } = await auth.getUser()

      const res = await fetch('/api/check-admin', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      const { isAdmin } = await res.json()
      return this.setState({ isAdmin })
    }

    render () {
      const { authenticated, isAdmin } = this.state
      if (authenticated === null) return null
      const authNav = authenticated
        ? (
          <NavContainer>
            <StyledLink onClick={() => this.props.auth.logout()}>
              Logout
            </StyledLink>
            <StyledLink to="/profile">User Profile</StyledLink>
            {isAdmin ? <StyledLink to="/admin">Admin</StyledLink> : null}
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
