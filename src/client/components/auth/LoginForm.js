import React from 'react'
import OktaAuth from '@okta/okta-auth-js'
import { withAuth } from '@okta/okta-react'

import styled from 'styled-components'
import { Input } from 'antd'

import 'antd/dist/antd.css' // or 'antd/dist/antd.less'

const Container = styled.div`
  justify-content: center;
  padding: 60px;
  align-items: center;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 300px;
  background: yellow;
  text-align: left;
  margin: 0 auto;
  padding: 20px;
`

const StyledInput = styled(Input)`
  max-width: 300px;
`

const StyledButton = styled.button`
  margin-top: 20px;
  max-width: 100px;

`

const Label = styled.label`
`

export default withAuth(
  class LoginForm extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        sessionToken: null,
        error: null,
        username: '',
        password: '',
      }

      this.oktaAuth = new OktaAuth({ url: props.baseUrl })

      this.handleSubmit = this.handleSubmit.bind(this)
      this.handleUsernameChange = this.handleUsernameChange.bind(this)
      this.handlePasswordChange = this.handlePasswordChange.bind(this)
    }

    handleSubmit (e) {
      e.preventDefault()
      this.oktaAuth
        .signIn({
          username: this.state.username,
          password: this.state.password,
        })
        .then(res =>
          this.setState({
            sessionToken: res.sessionToken,
          }),
        )
        .catch(err => {
          this.setState({ error: err.message })
          console.log(err.statusCode + ' error', err)
        })
      return this.updateUserLastLogin()
    }

    handleUsernameChange (e) {
      this.setState({ username: e.target.value })
    }

    handlePasswordChange (e) {
      this.setState({ password: e.target.value })
    }

    async updateUserLastLogin () {
      return fetch('/api/update-last-login', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: this.state.username }),
      })
        .catch(err => console.log(err))
    }

    render () {
      if (this.state.sessionToken) {
        this.props.auth.redirect({ sessionToken: this.state.sessionToken })
        return null
      }

      const errorMessage = this.state.error
        ? (
          <span className="error-message">{this.state.error}</span>
          )
        : null

      return (
        <Container>
          <Form onSubmit={this.handleSubmit}>
            {errorMessage}
            <Label>Username:</Label>
            <StyledInput
              id="username"
              type="text"
              value={this.state.username}
              onChange={this.handleUsernameChange}
            />
            <Label>Password:</Label>
            <StyledInput
              id="password"
              type="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
            <StyledButton className="ant-btn" id="submit" type="submit" value="Submit">
              Submit
            </StyledButton>
          </Form>
        </Container>
      )
    }
  },
)
