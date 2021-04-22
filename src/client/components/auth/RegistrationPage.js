import React from 'react'
import OktaAuth from '@okta/okta-auth-js'
import { withAuth } from '@okta/okta-react'

import config from '../../app.config'

import styled from 'styled-components'
import { Input } from 'antd'

import 'antd/dist/antd.css' // or 'antd/dist/antd.less'
import backgroundasset from '../../assets/purple.svg'

const Container = styled.div`
  padding: 60px;
  display: flex;
  justify-content: center;
  text-align: center;

  background-image: url(${backgroundasset});
  height: 100vh;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  background: white;
  text-align: left;
  margin: 0 auto;
  height: fit-content;
  padding: 60px 60px;
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
  class RegistrationPage extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        sessionToken: null,
      }
      this.oktaAuth = new OktaAuth({ url: config.url })
      this.checkAuthentication = this.checkAuthentication.bind(this)
      this.checkAuthentication()

      this.handleSubmit = this.handleSubmit.bind(this)
      this.handleFirstNameChange = this.handleFirstNameChange.bind(this)
      this.handleLastNameChange = this.handleLastNameChange.bind(this)
      this.handleEmailChange = this.handleEmailChange.bind(this)
      this.handlePasswordChange = this.handlePasswordChange.bind(this)
    }

    componentDidUpdate () {
      this.checkAuthentication()
    }

    handleFirstNameChange (e) {
      this.setState({ firstName: e.target.value })
    }

    handleLastNameChange (e) {
      this.setState({ lastName: e.target.value })
    }

    handleEmailChange (e) {
      this.setState({ email: e.target.value })
    }

    handlePasswordChange (e) {
      this.setState({ password: e.target.value })
    }

    handleSubmit (e) {
      e.preventDefault()
      fetch('/api/create', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.state),
      })
        .then(user => {
          this.oktaAuth
            .signIn({
              username: this.state.email,
              password: this.state.password,
            })
            .then(res =>
              this.setState({
                sessionToken: res.sessionToken,
              }),
            )
        })
        .catch(err => console.log(err))
    }

    async checkAuthentication () {
      const sessionToken = await this.props.auth.getIdToken()
      if (sessionToken) {
        this.setState({ sessionToken })
      }
    }

    render () {
      if (this.state.sessionToken) {
        this.props.auth.redirect({ sessionToken: this.state.sessionToken })
        return null
      }

      return (
        <Container>
          <Form onSubmit={this.handleSubmit}>
            <Label>Email:</Label>
            <StyledInput
              type="email"
              id="email"
              value={this.state.email}
              onChange={this.handleEmailChange}
            />
            <Label>First Name:</Label>
            <StyledInput
              type="text"
              id="firstName"
              value={this.state.firstName}
              onChange={this.handleFirstNameChange}
            />
            <Label>Last Name:</Label>
            <StyledInput
              type="text"
              id="lastName"
              value={this.state.lastName}
              onChange={this.handleLastNameChange}
            />
            <Label>Password:</Label>
            <StyledInput
              type="password"
              id="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
            <StyledButton className="ant-btn" type="submit" id="submit" value="Register">
              Register
            </StyledButton>
          </Form>
        </Container>
      )
    }
  },
)
