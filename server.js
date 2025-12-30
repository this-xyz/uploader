import express from 'express'
import multer from 'multer'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()
const app = express()
const upload = multer()

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file
    const buffer = file.buffer
    const mime = file.mimetype
    const ext = mime.split('/')[1] || 'bin'
    const filename = Math.random().toString(36).slice(2,6) + '.' + ext
    const base64 = buffer.toString('base64')

    const response = await fetch(`https://api.github.com/repos/${process.env.REPO}/contents/files/${filename}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'upload-web'
      },
      body: JSON.stringify({
        message: 'Subido',
        content: base64
      })
    })

    const data = await response.json()
    if (data?.content?.download_url) {
      res.json({ url: `https://cdn.yuki-wabot.my.id/files/${filename}` })
    } else {
      res.status(500).send(data.message || 'Error en subida')
    }
  } catch (e) {
    res.status(500).send(e.message)
  }
})

app.listen(3000, () => console.log('Servidor en http://localhost:3000'))
