import React from 'react'
import { withAuth } from '@okta/okta-react'

import styled from 'styled-components'
import 'antd/dist/antd.css' // or 'antd/dist/antd.less'

const Container = styled.div`
  display: flex;
  flex-direction: column;

  background: yellow;
  max-width: 300px;

  margin: 0 auto;
  margin-top: 60px;
  padding: 20px;

  text-align: left;

`

const Title = styled.h1`

`

const Text = styled.span`

`

const Button = styled.button`
  margin-top: 20px;
  max-width: 100px;
`

export default withAuth(
  class ProfilePage extends React.Component {
    constructor (props) {
      super(props)
      this.state = { name: null, email: null }
      this.getCurrentUser = this.getCurrentUser.bind(this)
    }

    componentDidMount () {
      this.getCurrentUser()
    }

    async getCurrentUser () {
      const { auth } = this.props
      const { name, email } = await auth.getUser()
      return this.setState({ name, email })
    }

    async deactivate () {
      const { auth } = this.props
      await auth.logout()

      return fetch('/api/deactivate', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.state.email }),
      })
        .then(user => {
          return window.location('/')
        })
        .catch(err => console.log(err))
    }

    render () {
      const { name, email } = this.state
      if (!email) return null

      console.log('auth', this.props.auth)
      return (
        <Container>
          <Title>User Profile</Title>
          <Text>Name: {name}</Text>
          <Text>Email: {email}</Text>
          <Button className="ant-btn" onClick={() => this.deactivate()}>deactivate</Button>
        </Container>
      )
    }
  },
)
