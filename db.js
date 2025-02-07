const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',              // Usuario
  password: 'rodilla', // 🔹 Asegúrate de colocar la contraseña correcta aquí
  database: 'election_db'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar con MySQL:', err);
    return;
  }
  console.log('✅ Conectado a MySQL');
});

module.exports = connection;


