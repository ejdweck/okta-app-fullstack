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
  console.log(' WE HERE', req.body)
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
  // if (!req.body) return res.sendStatus(400)
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

app.post('/api/add-user-to-group', (req, res) => {
  if (!req.body) return res.sendStatus(400)

  const { email } = req.body.email

  return oktaClient
    .getUser(email)
    .then((user) => {
      user.addToGroup(ADMIN_GROUP_ID)
      // oktaClient.removeUserFromGroup('00glrsuxnPnYam8cq5d6', user.id)
        .then(() => {
          console.log('User has been removed to group')
          res.status(201)
        })
    })
})

app.post('/api/remove-user-from-group', (req, res) => {
  if (!req.body) return res.sendStatus(400)

  const { email } = req.body.email

  return oktaClient
    .getUser(email)
    .then((user) => {
      oktaClient.removeUserFromGroup(ADMIN_GROUP_ID, user.id)
        .then(() => {
          console.log('User has been removed to group')
          res.status(201)
        })
    })
    .catch((err) => {
      res.status(400)
      res.send(err)
    })
})

app.get('/api/list-group-members', async (req, res) => oktaClient.listGroupMembers(ADMIN_GROUP_ID)
  .then((members) => {
    res.status(200)
    res.send(members)
  }))

app.post('/api/deactivate', (req, res) => {
  if (!req.body) return res.sendStatus(400)

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
