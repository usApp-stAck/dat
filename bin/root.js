var fs = require('fs')
var path = require('path')

module.exports = {
  name: '', // tells subcommand to use this to match e.g. `dat` w/ no subcommand
  options: [
    { name: 'version', alias: 'v', boolean: false }
  ],
  command: onCommand
}

function onCommand (args) {
  if (args.version) return console.log(require('../package.json').version)

  console.error(fs.readFileSync(path.join(__dirname, '..', 'usage', 'root.txt')).toString())
}
