#!/usr/bin/env node --loader ts-node/esm

import { test }  from 'tstest'

test('integration testing', async t => {
  t.pass('ok')
})
