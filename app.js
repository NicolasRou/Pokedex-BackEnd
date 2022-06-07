const express = require('express')
const axios = require('axios');
const db = require('./db/index');
const app = express()
const port = 3000


app.get ('/pokemones', async (req,res,next) => {

  try {

    const pokemonResults = []

  


    const pokemones = await db.query(`SELECT p.id pokemon_id,
                                      p.NAME,
                                      p.info,
                                      p.element_1,
                                      p.element_2,
                                      a.weight,
                                      a.height,
                                      a.moves,
                                      bs.hp,
                                      bs.def,
                                      bs.atk,
                                      bs.satk,
                                      bs.sdef,
                                      bs.spd
                                  FROM   pokemon p
                                      JOIN about a
                                        ON a.id = p.about_id
                                      JOIN base_stats bs
                                        ON bs.id = p.base_stats_id `)
    
   for (let index = 0; index < pokemones.rows.length; index++) {

     pokemonResults.push({
       name:pokemones.rows[index].name,
       about:{
         height:pokemones.rows[index].height,
         weight:pokemones.rows[index].weight,
         moves:pokemones.rows[index].moves,
       },
       elements:{ element1: pokemones.rows [index].element_1 ,
                  element2: pokemones.rows [index].element_2},   
                
                
       baseStats:{
         hp: pokemones.rows[index].hp,
         def: pokemones.rows[index].def,
         atk: pokemones.rows[index].atk,
         satk: pokemones.rows[index].satk,
         sdef: pokemones.rows[index].sdef,
         spd: pokemones.rows[index].spd,
       }         
                
                })                 
        
        
                                    
  }
  
  return res.status(200).json ({data: pokemonResults})

  } catch (error) {
    return next (error)
    
  }})




 
app.listen(port, () => {
  console.log(`Ejecutando aplicación.... ${port}`)
})