const fs = require('fs')
const readline = require('readline')
const { log } = console

function verifyTypeRun (prop) {
  return prop === 'client' || prop === 'server'
}

function verifyFolder (prop) {
  if (typeof prop !== 'undefined') {
    if (!fs.existsSync(`${prop}`)) {
      fs.mkdirSync(`${prop}`, { recursive: true }, err => {
        err && log(err)
      })
    }
    return `${prop}` 
  } else {
    return ''
  }
}

function createManifestFile ({author, des, ver, data, dir}) {
  let scripts
  if (data.length === 1) {
    if (data[0] === 'Client.js') {
      scripts = `client_script 'client.js'`
    } else {
      scripts = `server_script 'server.js'`
    }
  } else {
    scripts = `
  client_script 'client.js'
  server_script 'server.js'`
  }
  fs.writeFile(`${dir}/fxmanifest.lua`, `
  -- Resource Metadata
  fx_version 'cerulean'
  games { 'gta5' }

  author '${author}'
  description '${des}'
  version '${ver}'

  ${scripts}
  `, (err) => {
    err && log(err)
  })
}

module.exports.create = () => {
  const props = process.argv.slice(2)
  verifyTypeRun(props[0]) && fs.writeFile(`${verifyFolder(props[1])}/${props[0]}.ts`, "", (err) => {
    if (err) log(err)
  })
}

module.exports.manifest = () => {
  const pkg = require('./package.json')
  const author = pkg.fxmanimest.author
  const dir = pkg.fxmanimest.local_scripts
  const stdin = process.stdin
  const stdout = process.stdout
  const rl = readline.createInterface({
    input: stdin,
    output: stdout
  })
  rl.question('description: ', des => {
    rl.question('version: ', ver => {
      rl.question('script_name : ', scname => {
        fs.readdir(`${dir}/${scname}/`, (err, data) => {
          (err) ? log(err) : createManifestFile({author, des, ver, data, dir: `${dir}/${scname}/`})
          rl.close()
        })
      })
    })
  })
}
