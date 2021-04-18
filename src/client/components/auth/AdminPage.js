import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { withAuth } from '@okta/okta-react'

import styled from 'styled-components'
import _ from 'lodash'

const AdminCard = styled.div`
  display: flex;
  flex-direction: column;
  background: yellow;
  margin: 0 auto;
  margin-top: 60px;
  padding: 20px;
  max-width: 500px;
`

const UserBox = styled.div`
  display: flex;
  flex-direction: row;
  background: white;
`

const Text = styled.span`
  display: flex;
  flex-direction: row;
`

const Button = styled.button``

export default withAuth(class Login extends Component {
  constructor (props) {
    super(props)
    this.state = { authenticated: null, isAdmin: null }
    this.checkAuthentication = this.checkAuthentication.bind(this)
    this.getCurrentUser = this.getCurrentUser.bind(this)
  }

  componentDidMount () {
    this.checkAuthentication()
    this.getAllUsers()
  }

  async getCurrentUser () {
    const { auth } = this.props
    const { name, email } = await auth.getUser()
    return this.setState({ name, email })
  }

  async getAllUsers () {
    const { auth } = this.props
    const { email } = await auth.getUser()

    return fetch('/api/get-all-users')
      .then(res => res.json())
      .then(data => this.setState({ allUsers: data }))
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
    await this.checkIsAdminUser()
    const authenticated = await this.props.auth.isAuthenticated()
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated })
    }
  }

  async deactivate (email) {
    return fetch('/api/deactivate', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then(user => {
        return location.reload()
      })
      .catch(err => console.log(err))
  }

  renderAdminCard () {
    console.log('this.state', this.state.allUsers)
    const { allUsers } = this.state
    return (
      <div>
        {_.map(allUsers, (user) => {
          return (
            <UserBox>
              <Text>
                {user.profile.login}
              </Text>
              <Button className="ant-btn" onClick={() => this.deactivate(user.profile.login)}>deactivate</Button>
            </UserBox>
          )
        })}
      </div>
    )
  }

  render () {
    const { authenticated, isAdmin } = this.state
    if (authenticated === null) return null
    console.log('we true', authenticated, isAdmin)
    return isAdmin
      ? (
        <AdminCard>
          {this.renderAdminCard()}
        </AdminCard>
        )
      : <Redirect to={{ pathname: '/' }} />
  }
})
