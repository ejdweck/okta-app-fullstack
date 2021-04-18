const express = require('express')
const os = require('os')

const app = express()
const okta = require('@okta/okta-sdk-nodejs')
const _ = require('lodash')
const oktaClient = require('./lib/oktaClient')

const ADMIN_GROUP_ID = '00glrsuxnPnYam8cq5d6'

const client = new okta.Client({
  token: '00mWsKm3108tUas2RzR0X79mtV2HM9k7rZATrD2EIL',
  orgUrl: 'https://ejsguitarrentals.okta.com',
})

app.use(express.static('dist'))
app.use(express.json())

app.get('/api/getUsername', (req, res) => res.send({
  username: os.userInfo().username,
}))

app.post('/api/check-admin', async (req, res) => {
  if (!req.body) return res.sendStatus(400)
  const url = `${client.baseUrl}/api/v1/groups/${ADMIN_GROUP_ID}/users`
  const request = {
    method: 'get',
  // headers: {
  // Accept: 'application/xml',
  // 'Content-Type': 'application/json',
  // },
  }

  const { email } = req.body

  const adminUsers = await client.http.http(url, request)
    .then(resp => resp.text())
    .catch((err) => {
      console.error(err)
    })

  if (_.includes(adminUsers, email)) {
    return res.send({ isAdmin: true })
  } else {
    res.send({ isAdmin: false })
  }
})

app.get('/api/get-all-users', async (req, res) => {
  console.log(' WE HERE', req.body)
  const url = `${client.baseUrl}/api/v1/users`
  const request = {
    method: 'get',
  // headers: {
  // Accept: 'application/xml',
  // 'Content-Type': 'application/json',
  // },
  }

  const allUsers = await client.http.http(url, request)
    .then(resp => resp.text())
    .catch((err) => {
      console.error(err)
    })

  res.send(allUsers)
})

app.get('/api/get-admin-group-members', async (req, res) => {
  const url = `${client.baseUrl}/api/v1/groups/${ADMIN_GROUP_ID}/users`
  const request = {
    method: 'get',
  }

  const adminUsers = await client.http.http(url, request)
    .then(resp => resp.text())
    .catch((err) => {
      console.error(err)
    })

  res.send(adminUsers)
})

/* Create a new User (register). */
app.post('/api/create', (req, res) => {
  if (!req.body) return res.sendStatus(400)
  const newUser = {
    profile: {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      login: req.body.email,
    },
    credentials: {
      password: {
        value: req.body.password,
      },
    },
  }

  oktaClient
    .createUser(newUser)
    .then(user => oktaClient.assignUserToApplication('0oal961z1nBilUCEW5d6', {
      id: user.id,
    }))
    .then((user) => {
      res.status(201)
      res.send(user)
    })
    .catch((err) => {
      res.status(400)
      res.send(err)
    })
})

app.get('/api/user', (req, res) => {
  const { email } = req.body

  oktaClient
    .getUser(email)
    .then((user) => {
      res.status(201)
      res.send(user)
    })
    .catch((err) => {
      res.status(400)
      res.send(err)
    })
})

app.post('/api/add-user-to-admin-group', async (req, res) => {
  const { email } = req.body
  await oktaClient
    .getUser(email)
    .then((user) => user.addToGroup(ADMIN_GROUP_ID))
    .catch((err) => {
      res.status(400)
      res.send(err)
    })

  return res.send(201)
})

app.post('/api/remove-user-from-admin-group', async (req, res) => {
  const { email } = req.body
  const user = await oktaClient.getUser(email)

  const url = `${client.baseUrl}/api/v1/groups/${ADMIN_GROUP_ID}/users/${user.id}`
  const request = {
    method: 'delete',
  }

  const removeUser = await client.http.http(url, request)
    .then(resp => resp.text())
    .catch((err) => {
      console.error(err)
    })

  res.send(removeUser)
})

app.post('/api/deactivate', (req, res) => {
  const { email } = req.body
  return oktaClient
    .getUser(email)
    .then((user) => {
      user.deactivate()
        .then(() => console.log('User has been deactivated'))
        .then(() => user.delete())
        .then(() => res.status(204))
    })
    .catch((err) => {
      res.status(400)
      res.send(err)
    })
})

app.listen(process.env.PORT || 8080, () => console.log(`Listening on port ${process.env.PORT || 8080}!`))
