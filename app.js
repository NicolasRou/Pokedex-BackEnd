const express = require('express')
const axios = require('axios')
const app = express()
const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get('/estudiantes', (req,res) => {
//   const estudiantes = [
//     {nombre: "Nicolás", apellido: "Ribeiro"},
//     {nombre: "César", apellido: "Rolón"},
//     {nombre: "Santiago", apellido: "Rodriguez"},
//     {nombre: "Nati", apellido: "Ciraolo"},
//   ]

//     return res.send({ success: true, data: estudiantes })


// })


// app.get ('/pokemones', async (req,res) => {

//   // const userName = req.params.name
//   const response = await axios ("https://pokeapi.co/api/v2/pokemon/")

//   const poke = response.data.results

//   return res.send (poke[19].name);

// })


app.get("/pokemons", async (req, res) => {

  const pokemons = await axios('https://pokeapi.co/api/v2/pokemon/');

  const arrayPokemons =  pokemons.data.results;

  const nombresPokemons  = []

  for (let i = 0; i < arrayPokemons.length; i++) {

      nombresPokemons.push(arrayPokemons[i].name);
      

  }

  return res.send(nombresPokemons);

});


app.post("/usuarios", (req,res,next)=>{
  try {
    
  } catch (error) {
    
  }
})




app.listen(port, () => {
  console.log(`Ejecutando aplicación.... ${port}`)
})