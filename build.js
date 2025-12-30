import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const html = fs.readFileSync('index.html', 'utf8')
const injected = html
  .replace('${GITHUB_TOKEN}', process.env.GITHUB_TOKEN)
  .replace('${REPO}', process.env.REPO)
  .replace('${FOLDER}', process.env.FOLDER)
  .replace('${DOMAIN}', process.env.DOMAIN)

fs.writeFileSync('index.html', injected)
console.log('index.html actualizado con variables de entorno')
