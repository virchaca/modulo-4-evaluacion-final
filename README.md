# modulo-4-evaluacion-final-_Virginia Alvarez Perez_
    modulo-4-evaluacion-final-virchaca created by GitHub Classroom

Hemos desarrollado una API consisitente en una listado de furgonetas, con ciertas características, para poder gestionar una web de quedadas de furgonetas. Cada furgoneta tendrá un ususario, pero en ocasiones un usuario puede llegar a tener varias furgonetas.

Hemos creado un servidor con EXPRESS, generado la base de datos en MySQL, y hecho la conexion entre ambos.

En cada endpoints, como minimo seguimos los siguientes pasos:

```bash         
        //Seleccionar el tipo de método que vamos a utilizar
        app.GET/POST/PUT/DELETE ("URL del Endpoint", ...)

        //Hacer la consulta a la base de datos (por ejemplo mostrar todos los elementos)
        let query = "SELECT * FROM recetas";

         //hacer la conexión con la BD
        const conn = await getConnection();

        //Ejecutar esa consulta
        const [results] = await conn.query(query);
  
        // cerrar la conexion
        conn.end();

        //Enviar una respuesta
         res.json({
            info: {...}, 
             results: results, // listado
        });
```

1. `LIST ALL VANS FROM MY DB - GET `

```bash         
         server.get("/vans", async (req, res) => {...});
```

Con este endpoint de tipo GET, listaremos todas las vans que tenemos ahora mismo registradas:


```bash         
server.get("/vans", async (req, res) => {
    let query = "SELECT * FROM vans_details";
    const conn = await getConnection();
    const [results] = await conn.query(query);
    const numOfElements = results.length;
    conn.end();
    res.json({
    count: numOfElements,
    results: results,
  });
});
```



2. `INSERT A NEW VAN - POST `

```bash         
         server.post("/vans", async (req, res) => {...});
```

Insertamos una nueva furgoneta en nuestro listado por medio de un endpoint tipo POST, pasamos la informacion de la nueva furgoneta por los body params. Hacemos varias validaciones: 
- que los campos de año de matriculacion y numero de plazas sean números
- que la furgoneta a insertar no exista ya
- que si la inserccion de la nueva furgoneta falla, nos lo indique
- usamos el bloque try-catch ara que si ocurre algun otro error no contemplado en las validaciones, nos lo indique también


```bash
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
```


3. `UPDATE VANS INFO - PUT `

```bash         
         server.put("/vans/:id", async (req, res) => {...});
```

Actualizamos la informacion de una van ya registrada mediante el siguiente endpoint, de tipo PUT. Seleccionaremos la furgoneta a actuializar por medio de su id (URL params) y pasamos la informacion de la furgoneta, los detalles, por los body paramas. Hacemos varias validaciones: 
- que los campos de año de matriculacion y numero de plazas sean números
- que la furgoneta a actualizar no exista ya
- que si la actualizacion de la furgoneta falla, nos lo indique
- usamos el bloque try-catch ara que si ocurre algun otro error no contemplado en las validaciones, nos lo indique también


```bash

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

```

4. `REMOVE A VAN FROM THE LIST - DELETE`

```bash         
         server.delete("/vans/:id", async (req, res) => {...});
```

Para eliminar cualquier van que quiera darse de baja de nuestro registro, usaremos un endpoint tipo DELETE. Seleccionaremos la furgoneta a eliminar por medio de su id. Hacemos varias validaciones: 
- que la furgoneta a eliminar no exista
- usamos el bloque try-catch ara que si ocurre algun otro error no contemplado en las validaciones, nos lo indique también


```bash         
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
```



5. `GET ONE VAN BY ID - (GET /vans/:id)`

```bash         
         server.get("/vans/:id", async (req, res) => {...});
```

Podremos acceder a las características de una van en particular por medio de su ID, con el siguiente endpoint tipo GET. Hacemos varias validaciones: 
- que el ID buscado sea un numero entero
- que el ID buscado exista


```bash         
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
});
```



