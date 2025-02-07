Documentación de la API de Votaciones


Introducción
Modificar el archivo db.js con las credenciales de su base de datos local.


Esta API permite gestionar un sistema de votación, permitiendo la administración de votantes y candidatos, así como la emisión y consulta de votos.

Configuración

La API está construida con Node.js y Express.

Utiliza MySQL como base de datos.

Escucha en el puerto 3000.

Endpoints Disponibles

Votantes

GET /voters - Obtiene la lista de todos los votantes.

GET /voters/:id - Obtiene los detalles de un votante por su ID.

GET /Voter/:nombre/:email/ - Agrega un votante con el nombre y correo proporcionados.

DELETE /votersdelete/:id - Elimina un votante por su ID.


Candidatos

GET /Candidate - Obtiene la lista de todos los candidatos.

GET /Candidate/:id - Obtiene los detalles de un candidato por su ID.

GET /candidate/:nombre/:party/:votes - Agrega un candidato con nombre, partido y votos iniciales.

DELETE /Candidatedelete/:id - Elimina un candidato por su ID.


Votación


GET /vote - Obtiene todos los votos registrados.

POST /votes?voter_id=xx&candidate_id=xx - Registra un voto.

GET /votes/statistics - Obtiene estadísticas de votación (total de votos, votos por candidato y porcentaje).


Reglas de Negocio

Un votante no puede ser candidato y viceversa.

Un votante solo puede votar una vez.

Un candidato debe existir en la base de datos antes de recibir votos.


Al emitir un voto:

Se incrementa el contador de votos del candidato.

Se actualiza el estado del votante a "ha votado".

Cómo Ejecutar la API

Instala las dependencias:
npm install express mysql

Configura la conexión a la base de datos en db.js.
node Index.js

La API estará disponible en:
http://localhost:3000

Advertencia:Los endPoints estan validados en POSTMAN

Pasos de uso de los EndPoints

1-Endpoint para insertar un votante usando GET con dos parámetros (GET /insertVoter?name=...&email=...)
Ruta para insertar un candidato dinámicamente

Si tu quieres agregar un Votante lo que necesitas hacer es, ingresar los datos de:nombre, email en postman la sintaxis rquerida es la siguiente


GET http://localhost:3000/Voter/{nombre}/{email}/



Parametros
nombre:Nombre de la persona (String)   Validacion no puede agregar una persona con el mismo nombre 
email:correo electronico de la persona(String)



2-Endpoint para obtener todos los votantes (GET)

Para visualizar toda la tabla de votantes esta es la estructura:

GET http://localhost:3000/Voters

Sin Parametros


3- Endpoint Revisar la tabla de todo los candidatos
Para revisar la tabla la sintaxis:

GET http://localhost:3000/Candidate

Sin parametros


4-Endpoint para obtener detalles de un votante por ID (GET /voters/:id)

para mirar los detalles de los votantes:

GET http://localhost:3000/voters/{id}


Parametros
Id:identificador de un votante (Int)


4-Endpoint para obtener detalles de un votante por ID (GET /voters/:id)
La sintaxis es:

GET http://localhost:3000/Candidate/{id}

Parametros
Id:identificador de un candidato (Int)


5-Endpoint para eliminar un votante por ID (DELETE /voters/:id)

para eliminar un votante la sintaxis es:

DELETE http://localhost:3000/votersdelete/{id}

Parametro

Id:identificador de un votante (Int)

6-Endpoint para eliminar un Candidato por ID (DELETE /voters/:id)
La sintaxis es: 

DELETE http://localhost:3000/Candidatedelete/{id}

Parametros
Id:identificador de un candidato (Int)

6- Endpoint para obtener todos los votos (GET)

Sintaxis:

GET http://localhost:3000/vote

Sin parametros


7-Endpoint para emitir un voto (POST /votes)
Sintaxis:

POST http://localhost:3000/votes

Sin parametros


8-Endpoint para revisar las estadisticas de las votaciones

Sintaxis:

GET http://localhost:3000/votes/statistics

Sin parametros 

Recuerda ejecutarlo en el postman

Captura de la estadisticas
{
    "total_votes": 4,
    "total_voters": 4,
    "votes_by_candidate": [
{
"candidate_id": 9,
"total_votes": 4,
"percentage": "100.00%"
}
]
}










