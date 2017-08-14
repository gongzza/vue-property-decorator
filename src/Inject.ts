import Vue, { PropOptions } from 'vue'
import { createDecorator } from 'vue-class-component'
import 'reflect-metadata'

type Key = string | symbol

function makeInject(key?: Key): PropertyDecorator {
  return createDecorator((componentOptions, k) => {
    if (typeof componentOptions.inject === 'undefined') {
      componentOptions.inject = {}
    }
    if (!Array.isArray(componentOptions.inject)) {
      componentOptions.inject[k] = key || k
    }
  })
}

function Inject(proto: Vue, key: string): void
function Inject(key?: string | symbol): PropertyDecorator
function Inject(a?: Vue | Key, b?: string): PropertyDecorator | void {
  if (typeof b === 'string') {
    const key: string = b
    const proto: Vue = a as Vue
    return makeInject()(proto, key)
  } else {
    return makeInject(a as Key)
  }
}

export default Inject
