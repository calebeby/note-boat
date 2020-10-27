import { setup } from 'goober'
import { render, h } from 'preact'
import { App } from './app'
import './index.css'

setup(h)

render(<App />, document.getElementById('app') as HTMLElement)
