import {run} from '@cycle/run'
import {makeDOMDriver} from '@cycle/dom'
import {App} from './app'


const drivers = {
  DOM: makeDOMDriver('#root'),
}

run(App, drivers)
