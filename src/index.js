const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

// init express aplication
const serverPort = 4007;
server.listen(serverPort, () => {
  console.log(`Server listening at http://localhost:${serverPort}`);
});

// conexion with mysql DB
async function getConnection() {
  const connection = await mysql.createConnection({
    host: "Localhost",
    user: "root",
    password: "Mybootcamp@23",
    // password: process.env.PASS, //no funciona, mirar por que
    database: "vans_db",
  });
  await connection.connect();
  console.log(
    `Conexión establecida con la base de datos (identificador=${connection.threadId})`
  );

  return connection;
}


//LIST ALL VANS FROM MY DB - GET 
server.get("/vans", async (req, res) => {
  let query = "SELECT * FROM vans_details";
  const conn = await getConnection();
  const [results] = await conn.query(query);
  res.json({
    results: results,
  });
});

// INSERT A NEW VAN - POST 
server.post("/vans", async (req, res) => {
  const newVan = req.body;
  const { marca, año_matriculacion, color, numero_plazas } = newVan;
  let query =
    "INSERT INTO vans_details(marca, año_matriculacion, color, numero_plazas) VALUES (?, ?, ?, ?);";
  try {
    const conn = await getConnection();
    const [results] = await conn.query(query, [
      marca,
      año_matriculacion,
      color,
      numero_plazas,
    ]);
    if (results.affectedRows === 0) {
      res.json({
        success: false,
        message: "No se ha podido insertar",
      });
      return;
    }
    res.json({
      success: true,
      id: results.insertId,
      results: results,
    });
  } catch (error) {
    res.json({
      success: false,
      message: `Ha ocurrido un error${error}`,
    });
  }
});

//UPDATE VANS INFO - PUT 
//test my endpoint writing the idVan I want to update on the url -- http://localhost:4007/vans/16
server.put("/vans/:id", async (req, res) => {  
  const dataVan = req.body; //object, get req.body values
  const { marca, año_matriculacion, color, numero_plazas } = dataVan;
  const idVan = req.params.id; //get id through url params

   let sql =
    "UPDATE vans_details SET marca = ? , año_matriculacion = ?, color =?, numero_plazas = ? WHERE id = ?;";
    try {
     const conn = await getConnection();
    const [results] = await conn.query(sql, [
      marca,
      año_matriculacion,
      color,
      numero_plazas,
      idVan,
    ]);
    res.json({
      success: true,
      message: "Van actualizada correctamente",
    });

  } catch (error) {
    res.json({
      success: false,
      message: `Ha ocurrido un error${error}`,
    });
  }
});


// REMOVE A VAN FROM THE LIST - DELETE
server.delete("/vans/:id", async (req, res) => {  
  const idVan = req.params.id; //get id through url params
  let sql =
    " DELETE FROM vans_details WHERE id = ?;";
    try {
     const conn = await getConnection();
    const [results] = await conn.query(sql, [idVan,]);
    res.json({
      success: true,
      message: "Van eliminada :(",
    });

  } catch (error) {
    res.json({
      success: false,
      message: `Ha ocurrido un error${error}`,
    });
  }
});


//GET ONE VAN BY ID - (GET /vans/:id).
server.get("/vans/:id", async (req, res) => {  
  const idVan = req.params.id; //get id through url params

  if (isNaN(parseInt(idVan))) {
    //if the ID written is not a number tell me by message
    res.json({
      success: false,
      error: "El id debe ser un número",
    });
    return;
  }

  let query = "SELECT * FROM vans_details WHERE id = ?"; 
  const conn = await getConnection();
    const [results] = await conn.query(query, [idVan]);

  const numOfElements = results.length;
  if (numOfElements === 0) {
    //if the ID does not exists give me a message
    res.json({
      success: false,
      message: "No existe la van que buscas",
    });
    return;
  }
  res.json({
    results: results[0], 
  });
});


