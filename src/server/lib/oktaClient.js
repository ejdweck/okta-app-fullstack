const okta = require('@okta/okta-sdk-nodejs')

const client = new okta.Client({
  orgUrl: 'https://ejsguitarrentals.okta.com',
  token: '00mWsKm3108tUas2RzR0X79mtV2HM9k7rZATrD2EIL',
})

module.exports = client
