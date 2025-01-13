// SQLite Modul in Node.js Code verwenden
const sqlite3 = require('sqlite3');
const sqlite = require('sqlite');

// SQLite Datei angeben
const dbFilePath = 'hochschule.db'; //Bingewatch.db machen

async function main() {
  // Mit Datenbank verbinden
  const db = await sqlite.open({
    filename: dbFilePath,
    driver: sqlite3.Database,
  });

  // Auf Datenbank zugreifen (z. B. SELECT Befehl)
  const students = await db.all('SELECT * FROM student');
  console.log(students);

  // Verbindung zu Datenbank beenden
  await db.close();
}

main();