#!/usr/bin/env -S node --no-warnings --loader ts-node/esm
// @ts-check

import { test } from 'tstest'

import { PuppetTest } from './fixtures/puppet-test/puppet-test.js'

test('Integration testing', async t => {

  const puppet = new PuppetTest()

  puppet.on('login', _user => {
    t.pass('should receive a login event')
  })

  await puppet.start()
  puppet.login('test-user')
  await puppet.stop()
  t.ok(!puppet.isLoggedIn, 'puppet should not be logged in after stop')
})
