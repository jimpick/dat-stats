const choo = require('choo')
const css = require('sheetify')

css('./style.css', { global: true })

const app = choo()
app.use(require('./models/archive'))
app.route('/', require('./components/archive'))
app.mount('body')
