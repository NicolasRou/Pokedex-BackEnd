const express = require('express')
const db = require('./db/index');
const app = express()
const port = 5431
const cors = require ("cors")
const usersRoutes = require("./routes/user");



app.use (cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/users", usersRoutes);


app.get("/pokemones", async (req, res, next) => {
  try {
    const pokemonResults = [];

    const pokemones = await db.query(`SELECT p.id pokemon_id,
                                     p.name,
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
                                       bs.spd,
                                      img
                                    FROM   pokemon p
                                      JOIN about a
                                        ON a.id = p.about_id
                                      JOIN base_stats bs
                                        ON bs.id = p.base_stats_id `);

    for (let index = 0; index < pokemones.rows.length; index++) {
      pokemonResults.push({
        id: pokemones.rows[index].pokemon_id,
        name: pokemones.rows[index].name,
        img: pokemones.rows[index].img,
        about: {
          info: pokemones.rows[index].info,
          height: pokemones.rows[index].height,
          weight: pokemones.rows[index].weight,
          moves: pokemones.rows[index].moves,
        },
        elements: {
          element1: pokemones.rows[index].element_1,
          element2: pokemones.rows[index].element_2,
        },
        baseStats: {
          hp: pokemones.rows[index].hp,
          def: pokemones.rows[index].def,
          atk: pokemones.rows[index].atk,
          satk: pokemones.rows[index].satk,
          sdef: pokemones.rows[index].sdef,
          spd: pokemones.rows[index].spd,
        },
      });
    }

    return res
      .status(200)
      .json({ loading: false, data: { results: pokemonResults } });
  } catch (error) {
    return next(error);
  }
});

// app.post("/pokemon", async (req, res, next) => {
//   try {
//     const newPokemon = req.body;

//     const createAbout = await db.query(
//       "insert into about(height, weight, moves) values($1, $2, $3)",
//       [newPokemon.height, newPokemon.weight, newPokemon.moves]
//     );

//     const aboutId = await db.query("select max(id) from about");

//     const newBaseStats = await db.query(
//       "insert into base_stats(hp, def, atk, satk, sdef, spd) values($1, $2, $3, $4, $5, $6)",
//       [
//         newPokemon.hp,
//         newPokemon.def,
//         newPokemon.atk,
//         newPokemon.satk,
//         newPokemon.sdef,
//         newPokemon.spd,
//       ]
//     );

//     const baseStatsId = await db.query("select max(id) from base_stats");

//     const createPokemon = await db.query(
//       "insert into pokemon(name, info, img, about_id, base_stats_id, element_1, element_2) values($1, $2, $3, $4, $5, $6, $7)",
//       [
//         newPokemon.name,
//         newPokemon.info,
//         newPokemon.img,
//         aboutId.rows[0].max,
//         baseStatsId.rows[0].max,
//         newPokemon.element_1,
//         newPokemon.element_2,
//       ]
//     );

//     return res.send({
//       succes: true,
//       data: { createPokemon, createAbout, newBaseStats },
//     });
//   } catch (error) {
//     return next(error);
//   }
// });

app.get("/pokemones/:namePokemon", async (req, res, next) => {
  try {
    const namePokemon = req.params.namePokemon;
    const pokemones = await db.query("select * from pokemon where name = $1", [
      namePokemon,
    ]);
    const selectPokemon = pokemones.rows[0];
    return res.send({
      succes: true,
      data: { selectPokemon },
    });
  } catch (error) {
    return next(error);
  }
});

app.listen(port, () => {
  console.log(`Ejecutando aplicación.... ${port}`);
});

