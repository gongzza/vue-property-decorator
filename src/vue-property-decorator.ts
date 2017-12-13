/** vue-property-decorator verson 6.0.0 MIT LICENSE copyright 2017 kaorun343 */

'use strict'
import Vue, { PropOptions, WatchOptions } from 'vue'
import Component, { createDecorator } from 'vue-class-component'
import 'reflect-metadata'

export type Constructor = {
  new(...args: any[]): any
}

export { Component, Vue }

import Inject from './Inject'
import Provide from './Provide'
import Model from './Model'
import Prop from './Prop'
import Watch from './Watch'

export { Inject, Prop, Model, Provide, Watch }

// Code copied from Vue/src/shared/util.js
const hyphenateRE = /\B([A-Z])/g
const hyphenate = (str: string) => str.replace(hyphenateRE, '-$1').toLowerCase()

/**
 * decorator of an event-emitter function
 * @param  event The name of the event
 * @return MethodDecorator
 */
export function Emit(event?: string): MethodDecorator {
  return function (target: Vue, key: string, descriptor: any) {
    key = hyphenate(key)
    const original = descriptor.value
    descriptor.value = function emitter(...args: any[]) {
      if (original.apply(this, args) !== false)
        this.$emit(event || key, ...args)
    }
  }
}

/**
 * decorator of $off
 * @param event The name of the event
 * @param method The name of the method
 */
export function Off(event?: string, method?: string): MethodDecorator {
  return function (target: Vue, key: string, descriptor: any) {
    key = hyphenate(key)
    const original = descriptor.value
    descriptor.value = function offer(...args: any[]) {
      if (original.apply(this, args) !== false) {
        if (method) {
          if (typeof this[method] === 'function') {
            this.$off(event || key, this[method])
          } else {
            throw new TypeError('must be a method name')
          }
        } else if (event) {
          this.$off(event || key)
        } else {
          this.$off()
        }
      }
    }
  }
}

/**
 * decorator of $on
 * @param event The name of the event
 */
export function On(event?: string): MethodDecorator {
  return createDecorator((componentOptions, k) => {
    const key = hyphenate(k)
    if (typeof componentOptions.created !== 'function') {
      componentOptions.created = function () { }
    }
    const original: Function = componentOptions.created
    componentOptions.created = function () {
      original()
      if (typeof componentOptions.methods !== 'undefined') {
        this.$on(event || key, componentOptions.methods[k])
      }

    }
  })
}

/**
 * decorator of $once
 * @param event The name of the event
 */
export function Once(event?: string): MethodDecorator {
  return createDecorator((componentOptions, k) => {
    const key = hyphenate(k)
    if (typeof componentOptions.created !== 'function') {
      componentOptions.created = function () { }
    }
    const original: Function = componentOptions.created
    componentOptions.created = function () {
      original()
      if (typeof componentOptions.methods !== 'undefined') {
        this.$once(event || key, componentOptions.methods[k]);
      }
    }
  })
}

/**
 * decorator of $nextTick
 *
 * @export
 * @param {string} method
 * @returns {MethodDecorator}
 */
export function NextTick(method: string): MethodDecorator {
  return function (target: Vue, key: string, descriptor: any) {
    const original = descriptor.value
    descriptor.value = function emitter(...args: any[]) {
      if (original.apply(this, args) !== false)
        if (typeof this[method] === 'function') {
          this.$nextTick(this[method])
        } else {
          throw new TypeError('must be a method name')
        }
    }
  }
}
