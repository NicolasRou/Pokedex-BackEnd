const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/estudiantes', (req,res) => {
  const estudiantes = [
    {nombre: "Nicolás", apellido: "Ribeiro"},
    {nombre: "César", apellido: "Rolón"},
    {nombre: "Santiago", apellido: "Rodriguez"},
    {nombre: "Nati", apellido: "Ciraolo"},
  ]

    return res.send({ success: true, data: estudiantes })


})


app.get ('/repositorios/:userId', async (req,res) => {

  const userId = req.params.userId
  const response = await axios (`https://api.github.com/users/${userId}`)

  const repos = await axios (response.data.repos_url)

  return res.send (repos.data);

})



app.listen(port, () => {
  console.log(`Ejecutando aplicación.... ${port}`)
})