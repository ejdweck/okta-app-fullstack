import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  text-align: center;
  padding: 60px;
`

export default class HomePage extends React.Component {
  render () {
    return (
      <Container>
        <h1>Home Page</h1>
        <h2>unsecured!</h2>
      </Container>
    )
  }
}
