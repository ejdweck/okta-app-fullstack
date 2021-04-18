import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { withAuth } from '@okta/okta-react'

export default withAuth(class Login extends Component {
  constructor (props) {
    super(props)
    this.state = { authenticated: null }
    this.checkAuthentication = this.checkAuthentication.bind(this)
    this.checkAuthentication()
    this.getCurrentUser = this.getCurrentUser.bind(this)
  }

  componentDidMount () {
    return this.checkAuthentication()
  }

  async getCurrentUser () {
    const { auth } = this.props
    const { name, email } = await auth.getUser()
    return this.setState({ name, email })
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

  async checkAuthentication () {
    const authenticated = await this.props.auth.isAuthenticated()
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated })
    }
  }

  render () {
    const { authenticated, isAdmin } = this.state
    if (authenticated === null) return null

    return authenticated
      ? (isAdmin
          ? (
              'your authd bro'
            )
          : <Redirect to={{ pathname: '/' }} />
        )
      : <Redirect to={{ pathname: '/' }} />
  }
})
