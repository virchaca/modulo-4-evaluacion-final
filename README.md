# modulo-4-evaluacion-final-_Virginia Alvarez Perez_
    modulo-4-evaluacion-final-virchaca created by GitHub Classroom

Hemos desarrollado una API consisitente en una listado de furgonetas, y algunos detalles de las mismas, para poder gestionar una web de quedadas de furgonetas. 

Hemos creado un servidor con EXPRESS, generado la base de datos en MySQL, y hecho la conexion entre ambos.

La manera de comunicarnos con nuestra base de datos y hacer consultas o cambios en la misma es mediante unas estructuras de codigo llamadas "ENDPOINTS". Lo llamamos hacer peticiones, y en cada endpoints, como minimo seguimos los siguientes pasos:

```bash         
        - Seleccionar el tipo de método que vamos a utilizar según que peticion queramos hacer
        app.GET/POST/PUT/DELETE ("URL del Endpoint", ...)

        - Hacer la consulta a la base de datos (por ejemplo mostrar todos los elementos)
        - hacer la conexión con la BD
        - Ejecutar esa consulta
        - cerrar la conexion
        - Enviar una respuesta en formato JSON <(donde podemos definir informacion que queramos recibir internamente)
      
```

Para entrar desde el navegador en nuestra base de datos, tenemos que entrar en el puerto que hemos definido al crear el servidor y añadir en la url "/vans".


1. `LIST ALL VANS FROM MY DB - GET `

```bash         
         server.get("/vans", async (req, res) => {...});
```

Con este endpoint de tipo GET, listaremos todas las vans que tenemos ahora mismo registradas, que se verán en nuestra base de datos de la siguiente manera:


                      ```bash         
                      {
                      "count": (numero de vans en la base de datos),
                      "results": [
                        {
                        "id": 6,
                        "marca": "citroen Jumpy",
                        "año_matriculacion": "2005",
                        "color": "blanca",
                        "numero_plazas": "3"
                        },
                        {
                        "id": 7,
                        "marca": "volkswagen t3",
                        "año_matriculacion": "1998",
                        "color": "verde/blanca",
                        "numero_plazas": "2"
                        },
                        ...
                        ]
                      }
                      ```

 Usamos una estructura de código denominada bloque try-catch para que si ocurre algun error en la consulta, nos lo indique.


1. `INSERT A NEW VAN - POST `

```bash         
         server.post("/vans", async (req, res) => {...});
```

Insertamos una nueva furgoneta en nuestro listado por medio de un endpoint tipo POST, pasamos la informacion de la nueva furgoneta por los body params. Hacemos varias validaciones: 
- que los campos de año de matriculacion y numero de plazas sean números
- que la furgoneta a insertar no exista ya
- que si la inserccion de la nueva furgoneta falla, nos lo indique
- usamos el bloque try-catch para que si ocurre algun otro error no contemplado en las validaciones, nos lo indique también

Para insertar los datos, tendremos que introducir todos los campos de la tabla vans_details de la furgoneta a añadir, que son marca, año_matriculacion, color, numero_plazas, en formato JSON.
El id lo añade MySQL automáticamente ya que así lo hemos configurado al crear la estructura de la base de datos:

Introducimos los datos de la siguiente manera:
```bash
                        {
                        "marca": "renault traffic",
                        "año_matriculacion": "2003",
                        "color": "azul",
                        "numero_plazas": "5"
                        }
```
Y en la base de datos se nos crea la furgoneta, añadiendo el ID correspondiente:

```bash
                        {                          
                        "id": 8,
                        "marca": "renault traffic",
                        "año_matriculacion": "2003",
                        "color": "azul",
                        "numero_plazas": "5"
                        }
```


3. `UPDATE VANS INFO - PUT `

```bash         
         server.put("/vans/:id", async (req, res) => {...});
```

Actualizamos la informacion de una van ya registrada mediante el endpoint de tipo PUT. Seleccionaremos la furgoneta a actuializar por medio de su id (URL params) y pasamos la informacion de la furgoneta, los detalles, por los body paramas. Hacemos varias validaciones: 
- que los campos de año de matriculacion y numero de plazas sean números
- que la furgoneta a actualizar no exista ya
- que si la actualizacion de la furgoneta falla, nos lo indique
- usamos el bloque try-catch para que si ocurre algun otro error no contemplado en las validaciones, nos lo indique también.

Tenemos que definir la informacion de todos los campos, incluidos los que no vamos a modificar, ya que se actualizarán todos los campos de dichas furgonetas. En el siguiente ejemplo:

```bash
                        {
                        "marca": "renault traffic",
                        "año_matriculacion": "2003",
                        "color": "azul",
                        "numero_plazas": "5"
                        }
```

Para modificar el numero de plazas unicamente, escribiremos todo lo anterior y cambiaremos el numero de plazas:

```bash
                        {
                        "marca": "renault traffic",
                        "año_matriculacion": "2003",
                        "color": "azul",
                        "numero_plazas": "7"
                        }
```




4. `REMOVE A VAN FROM THE LIST - DELETE`

```bash         
         server.delete("/vans/:id", async (req, res) => {...});
```

Para eliminar cualquier van que quiera darse de baja de nuestro registro, usaremos un endpoint tipo DELETE. Seleccionaremos la furgoneta a eliminar por medio de su id. Hacemos varias validaciones: 
- que la furgoneta a eliminar no exista
- usamos el bloque try-catch para que si ocurre algun otro error no contemplado en las validaciones, nos lo indique también.

Simplemente tendremos que indicar el ID de la furgoneta que queremos eliminar. 



5. `GET ONE VAN BY ID - (GET /vans/:id)`

```bash         
         server.get("/vans/:id", async (req, res) => {...});
```

Podremos acceder a las características de una van en particular por medio de su ID, con el siguiente endpoint tipo GET. Hacemos varias validaciones: 
- que el ID buscado sea un numero entero
- que el ID buscado exista
- usamos el bloque try-catch para que si ocurre algun otro error no contemplado en las validaciones, nos lo indique también

Para ello indicaremos, por ejemplo en la url del navegador, el id al que queremos acceder:

```bash         

          vans/17 (accedemos a la van con id: 17)
  
```



Además en nuestra aplicacion hemos creado una base de datos con los usurarios, para registrar nuevos usuarios y que puedan logearse en su cuenta.

Los datos requeridos que hay que proprocionar opara registrarse son nombre, email y contraseña, y mediante el email determinamos que un mismo usuario no se registre dos veces.