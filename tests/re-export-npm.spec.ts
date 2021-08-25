#!/usr/bin/env node --loader ts-node/esm

import { test }  from 'tstest'

import {
  FileBox,
  MemoryCard,
  StateSwitch,
}                 from '../src/mod.js'

test('Re-export helper modules', async t => {
  t.true(FileBox,     'should re-export FileBox')
  t.true(MemoryCard,  'should re-export MemoryCard')
  t.true(StateSwitch, 'should re-export StateSwitch')
})
