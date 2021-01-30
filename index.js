function verifyTypeRun (prop) {
  return prop == 'client' || prop == 'server'
}

module.exports.create = () => {
  const fs = require('fs')
  const props = process.argv.slice(2)
  verifyTypeRun(props[0]) && fs.writeFile(`${props[0]}.ts`, "", () => {
    
  });
}
