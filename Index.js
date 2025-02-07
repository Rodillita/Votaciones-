const express = require('express');
const connection = require('./db'); // Importamos la conexión a MySQL

const app = express();
const PORT = 3000; // Definir puerto

// Middleware para permitir JSON en las solicitudes
app.use(express.json());

// 🔹 Endpoint para insertar un votante usando GET con dos parámetros (GET /insertVoter?name=...&email=...)
// Ruta para insertar un candidato dinámicamente
app.get('/Voter/:nombre/:email/', async (req, res) => {
  const { nombre, email } = req.params;

  try {
      // Verificar si el email ya existe en la tabla Candidate
      const candidateCheck = await checkIfCandidate(nombre);
      if (candidateCheck) {
          return res.status(400).json({ error: ' El nomnbre pertenece a un candidato y no puede ser votante' });
      }

      // Insertar nuevo votante
      const insertId = await insertVoter(nombre, email);
      res.json({ message: 'Votante agregado', id: insertId });
  } catch (error) {
      res.status(500).json({ error: 'Error al insertar el votante' });
  }
});

// 🔹Función para verificar si el email está en la tabla Candidate
const checkIfCandidate = (name) => {
  return new Promise((resolve, reject) => {
      const query = 'SELECT id FROM Candidate WHERE name = ?';

      connection.query(query, [name], (err, result) => {
          if (err) {
              console.error('Error al verificar candidato:', err);
              return reject(err);
          }
          resolve(result.length > 0); // Devuelve true si el email ya existe en Candidate
      });
  });
};

//🔹 Función para insertar votante en la base de datos
const insertVoter = (name, email) => {
  return new Promise((resolve, reject) => {
      const query = 'INSERT INTO Voter (name, email, has_voted) VALUES (?, ?, false)';

      connection.query(query, [name, email], (err, result) => {
          if (err) {
              console.error('Error al insertar Votante', err);
              return reject(err);
          }
          console.log(`Votante agregado con ID: ${result.insertId}`);
          resolve(result.insertId);
      });
  });
};


//🔹 Ruta para insertar un candidato dinámicamente
app.get('/candidate/:nombre/:party/:votes', async (req, res) => {
  const { nombre, party, votes } = req.params;

  try {
      // Verificar si el nombre ya existe en la tabla Voter
      const voterCheck = await checkIfVoterByName(nombre);
      if (voterCheck) {
          return res.status(400).json({ error: ' El nombre ya pertenece a un votante y no puede ser candidato' });
      }

      // Insertar candidato si el nombre no existe en Voter
      const insertId = await insertCandidate(nombre, party, votes);
      res.json({ message: 'Candidato agregado', id: insertId });
  } catch (error) {
      res.status(500).json({ error: ' Error al insertar candidato' });
  }
});

// 🔹 Función para verificar si el nombre ya existe en la tabla Voter
const checkIfVoterByName = (name) => {
  return new Promise((resolve, reject) => {
      const query = 'SELECT id FROM Voter WHERE name = ?';

      connection.query(query, [name], (err, result) => {
          if (err) {
              console.error(' Error al verificar nombre en Voter:', err);
              return reject(err);
          }
          resolve(result.length > 0); // Devuelve true si el nombre ya existe en Voter
      });
  });
};

//🔹 Función para insertar candidato en la base de datos
const insertCandidate = (name, party, votes) => {
  return new Promise((resolve, reject) => {
      const query = 'INSERT INTO Candidate (name, party, votes) VALUES (?, ?, ?)';

      connection.query(query, [name, party, votes], (err, result) => {
          if (err) {
              console.error(' Error al insertar candidato', err);
              return reject(err);
          }
          console.log(` Candidato agregado con ID: ${result.insertId}`);
          resolve(result.insertId);
      });
  });
};



// 🔹 Endpoint para obtener todos los votantes (GET)
app.get('/voters', (req, res) => {
  const query = 'SELECT * FROM Voter';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener votantes:', err);
      return res.status(500).json({ error: 'Error al obtener votantes' });
    }
    res.json(results); // Enviar la respuesta con los datos
  });

});

//🔹 Endpoint Revisar la tabla de todo los candidatos
app.get('/Candidate', (req, res) => {
  const query = 'SELECT * FROM Candidate';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener candidatos:', err);
      return res.status(500).json({ error: 'Error al obtener candidatos' });
    }
    res.json(results); // Enviar la respuesta con los datos
  });
});


// 🔹 Endpoint para obtener detalles de un votante por ID (GET /voters/:id)
app.get('/voters/:id', (req, res) => {
    const voterId = req.params.id;
    const query = 'SELECT * FROM Voter WHERE id = ?';

    connection.query(query, [voterId], (err, results) => {
        if (err) {
            console.error('❌ Error al obtener votante:', err);
            return res.status(500).json({ error: 'Error al obtener votante' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Votante no encontrado' });
        }

        res.json(results[0]); // Devuelve solo el primer resultado encontrado
    });
});

// 🔹 Endpoint para obtener detalles de un candidatos por ID (GET /Candidate/:id)
app.get('/Candidate/:id', (req, res) => {
  const CandidateId = req.params.id;
  const query = 'SELECT * FROM Candidate WHERE id = ?';

  connection.query(query, [CandidateId], (err, results) => {
      if (err) {
          console.error(' Error al obtener los candidatos:', err);
          return res.status(500).json({ error: 'Error al obtener los candidatos' });
      }

      if (results.length === 0) {
          return res.status(404).json({ error: 'Candidato no encontrado' });
      }

      res.json(results[0]); // Devuelve solo el primer resultado encontrado
  });
});


// 🔹 Endpoint para eliminar un votante por ID (DELETE /voters/:id)
app.delete('/votersdelete/:id', (req, res) => {
  const voterId = req.params.id;
  const query = 'DELETE FROM Voter WHERE id = ?';

  connection.query(query, [voterId], (err, result) => {
      if (err) {
          console.error(' Error al eliminar votante:', err);
          return res.status(500).json({ error: 'Error al eliminar votante' });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Votante no encontrado' });
      }

      res.json({ message: ` Votante con ID ${voterId} eliminado` });
  });
});

// 🔹 Endpoint para eliminar un Candidato por ID (DELETE /voters/:id)
app.delete('/Candidatedelete/:id', (req, res) => {
  const CandidateId = req.params.id;
  const query = 'DELETE FROM Candidate WHERE id = ?';

  connection.query(query, [CandidateId], (err, result) => {
      if (err) {
          console.error('Error al eliminar el candidato:', err);
          return res.status(500).json({ error: 'Error al eliminar el candidato' });
      }

      if (result.affectedRows === 0) {
          return res.status(404).json({ error: 'Candidato no encontrado' });
      }

      res.json({ message: ` Candidato con ID ${CandidateId} eliminado` });
  });
});
  // 🔹 Endpoint para obtener todos los votos (GET)
app.get('/vote', (req, res) => {
  const query = 'SELECT * FROM Vote';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener los votos', err);
      return res.status(500).json({ error: 'Error al obtener los votos' });
    }
    res.json(results); // Enviar la respuesta con los datos
  });

  });


 // 🔹 Endpoint para emitir un voto (POST /votes)
 app.post('/votes', async (req, res) => {
  const { voter_id, candidate_id } = req.query;

  if (!voter_id || !candidate_id) {
    return res.status(400).json({ error: ' Se requieren voter_id y candidate_id' });
  }

  try {
    // 🔹 Verificar si el votante ya ha votado
    const hasVoted = await checkIfVoterHasVoted(voter_id);
    if (hasVoted) {
      return res.status(400).json({ error: ' El votante ya ha emitido un voto y no puede votar nuevamente' });
    }

    // 🔹 Verificar si el candidate_id existe en la tabla Candidate
    const candidateExists = await checkIfCandidateExists(candidate_id);
    if (!candidateExists) {
      return res.status(400).json({ error: ' El candidato no existe en la base de datos' });
    }

    //  Insertar el voto si las validaciones son correctas
    const insertVoteQuery = 'INSERT INTO Vote (voter_id, candidate_id) VALUES (?, ?)';
    connection.query(insertVoteQuery, [voter_id, candidate_id], (err, result) => {
      if (err) {
        console.error('❌ Error al registrar el voto:', err);
        return res.status(500).json({ error: ' Error al registrar el voto' });
      }

      // 🔹 Actualizar el estado de has_voted a true
      const updateVoterQuery = 'UPDATE Voter SET has_voted = true WHERE id = ?';
      connection.query(updateVoterQuery, [voter_id], (updateErr) => {
        if (updateErr) {
          console.error('❌ Error al actualizar has_voted:', updateErr);
          return res.status(500).json({ error: ' Error al actualizar el estado del votante' });
        }

        //🔹Incrementar el conteo de votos del candidato
        const updateCandidateVotesQuery = 'UPDATE Candidate SET votes = votes + 1 WHERE id = ?';
        connection.query(updateCandidateVotesQuery, [candidate_id], (updateCandidateErr) => {
          if (updateCandidateErr) {
            console.error(' Error al actualizar votos del candidato:', updateCandidateErr);
            return res.status(500).json({ error: ' Error al actualizar votos del candidato' });
          }

          res.json({ 
            message: ' Voto registrado correctamente, votante actualizado y votos del candidato incrementados',
            vote_id: result.insertId
          });
        });
      });
    });

  } catch (error) {
    console.error('Error en la validación:', error);
    res.status(500).json({ error: ' Error en la validación del voto' });
  }
});


// 🔹 Función para verificar si un votante ya ha votado
const checkIfVoterHasVoted = (voter_id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM Vote WHERE voter_id = ?';

    connection.query(query, [voter_id], (err, result) => {
      if (err) {
        console.error(' Error al comprobar si el votante ya ha votado:', err);
        return reject(err);
      }
      resolve(result[0].count > 0); // Devuelve true si el votante ya ha votado
    });
  });
};

// 🔹 Función para verificar si el candidate_id existe
const checkIfCandidateExists = (candidate_id) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) AS count FROM Candidate WHERE id = ?';

    connection.query(query, [candidate_id], (err, result) => {
      if (err) {
        console.error(' Error al verificar si el candidato existe:', err);
        return reject(err);
      }
      resolve(result[0].count > 0); // Devuelve true si el candidato existe
    });
  });
};

// 🔹 Endpoint para revisar las estadisticas de las votaciones
app.get('/votes/statistics', (req, res) => {
  const totalVotesQuery = 'SELECT COUNT(*) AS total_votes FROM Vote';
  const votesByCandidateQuery = `
      SELECT candidate_id, COUNT(*) AS vote
      FROM Vote
      GROUP BY candidate_id
      ORDER BY vote DESC`;

  const totalVotersQuery = 'SELECT COUNT(DISTINCT voter_id) AS total_voters FROM Vote';

  connection.query(totalVotesQuery, (err, totalVotesResult) => {
      if (err) {
          console.error('Error al obtener el total de votos:', err);
          return res.status(500).json({ error: 'Error al obtener total de votos' });
      }

      // 🔹 Asegurar que totalVotes tenga un valor numérico válido
      const totalVotes = totalVotesResult[0]?.total_votes || 0;
      console.log('🔹 Total de votos obtenidos de la BD:', totalVotes);

      connection.query(votesByCandidateQuery, (err, votesByCandidateResult) => {
          if (err) {
              console.error(' Error al obtener votos por candidato:', err);
              return res.status(500).json({ error: 'Error al obtener votos por candidato' });
          }

          console.log('🔹 Resultado de votos por candidato:', votesByCandidateResult);

          connection.query(totalVotersQuery, (err, totalVotersResult) => {
              if (err) {
                  console.error(' Error al obtener total de votantes:', err);
                  return res.status(500).json({ error: 'Error al obtener total de votantes' });
              }

              const statistics = votesByCandidateResult.map(candidate => {
                  console.log(' Procesando candidato:', candidate);

                  const votes = parseInt(candidate.vote, 10) || 0;
                  const total = totalVotes; // Ya está definido correctamente

                  console.log(' candidate_id:', candidate.candidate_id);
                  console.log(' votos obtenidos (antes de conversión):', candidate.vote);
                  console.log(' votos después de parseInt:', votes);
                  console.log(' totalVotes (revisado):', total, 'Tipo:', typeof total);

                  const percentage = total > 0 ? ((votes / total) * 100).toFixed(2) + '%' : '0%';

                  console.log(' Porcentaje calculado:', percentage);

                  return {
                      candidate_id: candidate.candidate_id,
                      total_votes: votes,
                      percentage: percentage
                  };
              });

              res.json({
                  total_votes: totalVotes,
                  total_voters: totalVotersResult[0]?.total_voters || 0,
                  votes_by_candidate: statistics
              });
          });
      });
  });
});


// 🔹 Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});

