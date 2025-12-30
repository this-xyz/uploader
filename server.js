import express from 'express'
import multer from 'multer'
import fs from 'fs'
import path from 'path'

const app = express()
const upload = multer()
const folder = path.join(process.cwd(), 'files')

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    const mime = file.mimetype
    const ext = mime.split('/')[1] || 'bin'
    const filename = Math.random().toString(36).slice(2, 6) + '.' + ext
    const filepath = path.join(folder, filename)

    if (!fs.existsSync(folder)) fs.mkdirSync(folder)

    fs.writeFileSync(filepath, file.buffer)

    const url = `https://cdn.yuki-wabot.my.id/files/${filename}`
    res.json({ url })
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.listen(3000)
