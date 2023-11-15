const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
require("dotenv").config();

// create and config server
const server = express();
server.use(cors());
server.use(express.json());

//Install and set JWT y bcrypt
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
    // password: "Mybootcamp@23",
    password: process.env.PASS,
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
  try {
    const [results] = await conn.query(query);
    const numOfElements = results.length;
    conn.end();
    res.json({
      count: numOfElements,
      results: results,
    });
  } catch (error) {
    res.json({
      success: false,
      message: `Ha ocurrido un error:${error}`,
    });
  }
});

// INSERT A NEW VAN - POST
server.post("/vans", async (req, res) => {
  const newVan = req.body;
  const { marca, año_matriculacion, color, numero_plazas } = newVan;
  let selectQuery =
    "SELECT * FROM vans_details WHERE marca = ? AND año_matriculacion = ?;";
  let query =
    "INSERT INTO vans_details(marca, año_matriculacion, color, numero_plazas) VALUES (?, ?, ?, ?);";

  if (isNaN(parseInt(año_matriculacion && numero_plazas))) {
    //if the year written or seats are not a number tell me by message and do not insert the van
    res.json({
      success: false,
      error: "Año de matriculacion y numero de plazas deben ser un número",
    });
    return;
  }

  try {
    const conn = await getConnection();

    // Verify if the van already exists
    const [existingVan] = await conn.query(selectQuery, [
      marca,
      año_matriculacion,
      color,
    ]);

    if (existingVan.length > 0) {
      // If the van exists, send me a message
      res.json({
        success: false,
        message: `Esta furgoneta ya existe, su id es ${existingVan[0].id} `,
        results: existingVan,
      });
      return;
    }

    // Insert the new van if it does not exist yet
    const [results] = await conn.query(query, [
      marca,
      año_matriculacion,
      color,
      numero_plazas,
    ]);

    if (results.affectedRows === 0) {
      //the insertion failed
      res.json({
        success: false,
        message: "No se ha podido insertar tu van",
      });
      return;
    }
    conn.end();
    res.json({
      success: true,
      id: results.insertId,
      results: results,
    });
  } catch (error) {
    res.json({
      success: false,
      message: `Ha ocurrido un error:${error}`,
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

  if (isNaN(parseInt(año_matriculacion && numero_plazas))) {
    //if the year written or seats are not a number tell me by message and do not update the van
    res.json({
      success: false,
      error: "Año de matriculacion y numero de plazas deben ser un número",
    });
    return;
  }
  try {
    const conn = await getConnection();
    const [results] = await conn.query(sql, [
      marca,
      año_matriculacion,
      color,
      numero_plazas,
      idVan,
    ]);

    if (results.affectedRows === 0) {
      //the van chosen does not exist
      res.json({
        success: false,
        message: `Lo siento pero no existe la van ${idVan}`,
      });
      return;
    }
    if (results.affectedRows === 0) {
      //the updating failed
      res.json({
        success: false,
        message: "No se ha podido actualizar tu van",
      });
      return;
    }
    conn.end();
    res.json({
      success: true,
      message: `Van ${idVan} actualizada correctamente`,
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
  let sql = " DELETE FROM vans_details WHERE id = ?;";

  try {
    const conn = await getConnection();
    const [results] = await conn.query(sql, [idVan]);
    if (results.affectedRows === 0) {
      //the van chosen does not exist
      res.json({
        success: false,
        message: `Lo siento pero no existe la van ${idVan}`,
      });
      return;
    }
    conn.end();
    res.json({
      success: true,
      message: `La Van ${idVan} ha sido eliminada :(`,
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
  try {
    const conn = await getConnection();
    const [results] = await conn.query(query, [idVan]);
    const numOfElements = results.length;
    conn.end();
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
  } catch (error) {
    res.json({
      success: false,
      message: `Ha ocurrido un error:${error}`,
    });
  }
});


//REGISTER A NEW USER
server.post("/register", async (req, res) => {
  const email = req.body.email;
  const username = req.body.nombre;
  const password = req.body.password;

  const passwordHashed = await bcrypt.hash(password, 10);
  const sql =
    "INSERT INTO usuarios_db (email, nombre, password) VALUES (?, ? ,?)";

  try {
    const conn = await getConnection();    
    const [results] = await conn.query(sql, [email, username, passwordHashed]);
    
    // Generate JWT token
    const token = jwt.sign({ userId: results.insertId, email }, 'secret', { expiresIn: '1h' });

    conn.end();
    res.json({
      success: true,
      id: results.insertId,
      token: token,  // Enviar el token en la respuesta
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Error al registrar el usuario.",
    });
  }
});

//LOGIN

//login
const generateToken = (payload) => {
  const token = jwt.sign(payload, 'secreto', { expiresIn: '1h' });
    return token;
  };
  
  const verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, 'secreto');
      return decoded;
    } catch (err) {
      return null;
    }
  };
  
server.post("/login", async (req, res) => {
  //receive application info with user name and password.
  const body = req.body;

  //Buscar si el usuario existe en la bases de datos
  const sql = "SELECT * FROM usuarios_db WHERE email = ?";
  const connection = await getConnection();
  const [users] = await connection.query(sql, [body.email]);
  connection.end();

  const user = users[0]; //first element from list received from SELECT query
console.log(user);
  //prove if user exists and password is correct using bcrypt.compare.
  const passwordCorrect =
    user === null
      ? false
      : await bcrypt.compare(body.password, user.password);

  //if user does not exist or password incorrect, send a 401 state and error messsage
  if (!(user && passwordCorrect)) {
    return res.status(401).json({
      success:false,
      error: "Credenciales inválidas",
    });
  }

  //If credentials ar OK, will get an userForToken object with  user's username and id.
  const userForToken = {
    username: user.username,
    id: user.id,
  };

  //Generate token for front
  const token = generateToken(userForToken);

  //Finally if all is OK, the response is 200 state and send JSON object with token, users name and real name.
  res
    .status(200)
    .json({ success: true, token, 
      nombre: `usuario: ${user.nombre}`,
      message: 'te has logueado correctamente'});
});

//GET ALL USERS - PRIVATE INFO FOR PROGRAMMERS
server.get("/users", async (req, res) => {
  let query = "SELECT * FROM usuarios_db";
  const conn = await getConnection();
  try {
    const [results] = await conn.query(query);
    const numOfElements = results.length;
    conn.end();
    res.json({
      count: numOfElements,
      results: results,
    });
  } catch (error) {
    res.json({
      success: false,
      message: `Ha ocurrido un error:${error}`,
    });
  }
});