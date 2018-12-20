const fs = require('fs')
const { mo } = require('gettext-parser')

fs
.readdirSync(__dirname + '/src/languages')
.filter(name => name.slice(name.length - 2, name.length) === 'mo')
.forEach(name => {
  const filename = name.slice(0, name.length - 3)
  const path = __dirname + '/src/languages/' + name
  const content = fs.readFileSync(path)
  const translations = mo.parse(content)
  const json = JSON.stringify(translations)

  fs.writeFileSync(__dirname + '/src/languages/' + filename + '.json', json, 'utf8')
})
