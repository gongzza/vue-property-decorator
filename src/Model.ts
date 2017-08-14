import Vue, { PropOptions } from 'vue'
import { createDecorator } from 'vue-class-component'
import 'reflect-metadata'

function makeModel(event?: string): PropertyDecorator {
  return createDecorator((componentOptions, prop) => {
    componentOptions.model = { prop, event: event || prop }
  })
}

function Model(proto: Vue, key: string): void
function Model(event: string): PropertyDecorator
function Model(a: Vue | string, b?: string): PropertyDecorator | void {
  if (typeof b === 'string') {
    const key: string = b
    const proto: Vue = a as Vue
    return makeModel()(proto, key)
  } else if (typeof a === 'string') {
    return makeModel(a)
  }
}

export default Model
