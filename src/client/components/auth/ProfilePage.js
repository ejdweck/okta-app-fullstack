import React from 'react'
import { withAuth } from '@okta/okta-react'

import styled from 'styled-components'
import 'antd/dist/antd.css' // or 'antd/dist/antd.less'

import { Input } from 'antd'

const Container = styled.div`
  display: flex;
  flex-direction: column;

  background: yellow;
  max-width: 800px;

  margin: 0 auto;
  margin-top: 60px;
  padding: 20px;

  text-align: left;
`

const Title = styled.h1``

const Text = styled.span``

const Button = styled.button`
  margin-top: 20px;
  max-width: 100px;
`

const StyledInput = styled(Input)`
  max-width: 300px;
  margin-right: 10px;
`

const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export default withAuth(
  class ProfilePage extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        name: null,
        email: null,
        lastlogin: null,
        updateCoffeePreference: null,
      }
      this.getCurrentUser = this.getCurrentUser.bind(this)
      this.handleCoffeePreferenceChange = this.handleCoffeePreferenceChange.bind(this)
    }

    componentDidMount () {
      this.getCurrentUser()
    }

    handleCoffeePreferenceChange (e) {
      this.setState({ updateCoffeePreference: e.target.value })
    }

    async handleUpdateCoffeePreference () {
      return fetch('/api/update-coffee-preference', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email,
          coffeePreference: this.state.updateCoffeePreference,
        }),
      })
        .catch(err => console.log(err))
    }

    async getCurrentUser () {
      const { auth } = this.props
      const { email } = await auth.getUser()
      const user = await fetch(`/api/get-user?email=${email}`)
        .then(res => res.json())
      const { firstName, lastName, last_login, coffeePreference } = user.profile

      return this.setState({
        name: firstName + ' ' + lastName,
        email,
        lastlogin: new Date(last_login).toString(),
        coffeePreference,
      })
    }

    async updateUserLastLogin () {
      return fetch('/api/update-last-login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.state.email }),
      })
        .catch(err => console.log(err))
    }

    render () {
      const { name, email, lastlogin, coffeePreference, updateCoffeePreference } = this.state
      if (!email) return null

      return (
        <Container>
          <Title>User Profile</Title>
          <Text>Name: {name}</Text>
          <Text>Email: {email}</Text>
          <Text>Last login: {lastlogin}</Text>
          <Text>Coffee preference: {coffeePreference}</Text>

          <InputContainer>
            <StyledInput
              id="username"
              placeholder="Coffee preference?"
              type="text"
              value={updateCoffeePreference}
              onChange={this.handleCoffeePreferenceChange}
            />
            <button onClick={() => this.handleUpdateCoffeePreference()}>update</button>
          </InputContainer>
        </Container>
      )
    }
  },
)
