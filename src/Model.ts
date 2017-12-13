import Vue, { PropOptions } from 'vue'
import { createDecorator } from 'vue-class-component'
import 'reflect-metadata'

export type Constructor = {
  new(...args: any[]): any
}

/**
 * decorator of model
 * @param  event event name
 * @return PropertyDecorator
 */
function makeModel(event?: string, options: (PropOptions | Constructor[] | Constructor) = {}): PropertyDecorator {
  return function (target: Vue, key: string) {
    if (!Array.isArray(options) && typeof (options as PropOptions).type === 'undefined') {
      (options as PropOptions).type = Reflect.getMetadata('design:type', target, key)
    }
    createDecorator((componentOptions, k) => {
      (componentOptions.props || (componentOptions.props = {}) as any)[k] = options
      componentOptions.model = { prop: k, event: event || k }
    })(target, key)
  }
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
