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
  padding: 20px;
  width: 100%;
`

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: green;
  margin: 0 auto;
  margin-top: 60px;
  padding: 20px;
  max-width: 800px;
`

const UserBox = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: white;
`

const Text = styled.span`
  display: flex;
  flex-direction: row;
`

const Button = styled.button`
  margin-left: 10px;
  margin-right: 10px;
`

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
    this.getAdminGroupUsers()
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

  async getAdminGroupUsers () {
    const { auth } = this.props
    const { email } = await auth.getUser()

    return fetch('/api/get-admin-group-members')
      .then(res => res.json())
      .then(data => this.setState({ adminUsers: data }))
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
    await fetch('/api/deactivate', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .catch(err => console.log(err))
    return window.location.reload('/admin')
  }

  async addUserToAdminGroup (email) {
    await fetch('/api/add-user-to-admin-group', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .catch(err => console.log(err))
    return window.location.reload('/admin')
  }

  async removeUserFromAdminGroup (email) {
    await fetch('/api/remove-user-from-admin-group', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .catch(err => console.log(err))
    return window.location.reload('/admin')
  }

  renderAdminCard () {
    const { allUsers, adminUsers } = this.state
    return (
      <CardContainer>
        All Users
        <AdminCard>
          {_.map(allUsers, (user) => {
            return (
              <UserBox>
                <Text>
                  {user.profile.login}
                </Text>
                <div>
                  <Button className="ant-btn" onClick={() => this.addUserToAdminGroup(user.profile.login)}>add to admin group</Button>
                  <Button className="ant-btn" onClick={() => this.deactivate(user.profile.login)}>deactivate</Button>
                </div>
              </UserBox>
            )
          })}
        </AdminCard>

        Admin Users
        <AdminCard>
          {_.map(adminUsers, (user) => {
            return (
              <UserBox>
                <Text>
                  {user.profile.login}
                </Text>
                <div>
                  <Button className="ant-btn" onClick={() => this.removeUserFromAdminGroup(user.profile.login)}>remove user from admin group</Button>
                  <Button className="ant-btn" onClick={() => this.deactivate(user.profile.login)}>deactivate</Button>
                </div>
              </UserBox>
            )
          })}
        </AdminCard>
      </CardContainer>
    )
  }

  render () {
    const { authenticated, isAdmin } = this.state
    if (authenticated === null) return null
    return isAdmin
      ? this.renderAdminCard()
      : <Redirect to={{ pathname: '/' }} />
  }
})
