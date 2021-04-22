import React from 'react'
import styled from 'styled-components'

import backgroundasset from '../../assets/blue.svg'

const Container = styled.div`
  text-align: center;
  padding: 60px;

  background-image: url(${backgroundasset});
  height: 100vh;
`

const TextContainer = styled.div`
  padding: 20px;
  margin: 0 auto;
  background: white;
  border: 2px solid #2b2b2b;
  height: fit-content;
  width: 400px;
`

export default class HomePage extends React.Component {
  render () {
    return (
      <Container>
        <TextContainer>
          <h1>Ej's Rental Guitars 🎸</h1>
          <h2>this is an (unsecured!) landing page</h2>
          <h2>Rent a guitar from me ;)</h2>
        </TextContainer>
      </Container>
    )
  }
}
