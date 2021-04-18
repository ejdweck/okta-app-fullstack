import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { withAuth } from '@okta/okta-react'
import _ from 'lodash'
import LoginForm from './LoginForm'

export default withAuth(class Login extends Component {
  constructor (props) {
    super(props)
    this.state = { authenticated: null }
    this.checkAuthentication = this.checkAuthentication.bind(this)
    this.checkAuthentication()
    this.getCurrentUser = this.getCurrentUser.bind(this)
  }

  componentDidMount () {
    return this.checkIsAdminUser() & this.checkAuthentication()
  }

  async getCurrentUser () {
    const { auth } = this.props
    const { name, email } = await auth.getUser()
    return this.setState({ name, email })
  }

  async checkIsAdminUser () {
    const { auth } = this.props
    const { email } = await auth.getUser()

    return fetch('/api/check-admin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((res) => {
        console.log('res', res)
        // return window.location('/')
      })
      .catch(err => console.log(err))
  }

  async checkAuthentication () {
    const authenticated = await this.props.auth.isAuthenticated()
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated })
    }
  }

  render () {
    // if (this.state.authenticated === null) return null
    // return this.state.authenticated
    //   ? 'your authd bro'
    //   : <Redirect to={{ pathname: '/' }} />
    return (
      <div>
        'hi'
      </div>
    )
  }
})
