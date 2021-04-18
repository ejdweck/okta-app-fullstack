import React from 'react'
import styled from 'styled-components'
import { Input } from 'antd'

import 'antd/dist/antd.css' // or 'antd/dist/antd.less'

const Container = styled.div`
  justify-content: center;
  align-items: center;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
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

export default class RegistrationForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      sessionToken: null,
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleFirstNameChange = this.handleFirstNameChange.bind(this)
    this.handleLastNameChange = this.handleLastNameChange.bind(this)
    this.handleEmailChange = this.handleEmailChange.bind(this)
    this.handlePasswordChange = this.handlePasswordChange.bind(this)
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
      .catch(err => console.log(err))

    return window.location.reload('/admin')
  }

  render () {
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
}
