const http = require('http');
const mongodb = require('mongodb');

const hostname = '127.0.0.1'; // localhost
const port = 3000;
const url = 'mongodb://127.0.0.1:27017'; // für lokale MongoDB
const mongoClient = new mongodb.MongoClient(url);

async function startServer() {
  await mongoClient.connect(); // Verbindung zur Datenbank herstellen
  server.listen(port, hostname, () => { // Server starten
    console.log(`Server running at http://${hostname}:${port}/`);
  });
}

const server = http.createServer(async (request, response) => {
    response.statusCode = 200; //hat funktioniert
    response.setHeader('Access-Control-Allow-Origin', '*'); // bei CORS Fehler lasss drinne 

    let url = new URL(request.url || '', `http://${request.headers.host}`);
    console.log(url)
    switch (url.pathname) {
      case '/film': { // /film
        const filmCollection = mongoClient.db('filmwebseite').collection('film');
        switch (request.method) { 
          case 'GET': 
            let result;
              result = await filmCollection.find({}).toArray();
            response.setHeader('Content-Type', 'application/json');
            response.write(JSON.stringify(result));
            break;
          case 'POST':
            let jsonString = '';
            request.on('data', data => {
              jsonString += data; //entnimmt alle Daten entgegen und addiert sie
            });
            request.on('end', async () => {
              filmCollection.insertOne(JSON.parse(jsonString)); //wird wieder zum Objekt und speichert direkt in die Datenbank
            });
            break;
        }
        break;
      }
      case '/clearAll': //wenn es eine Option gäbe um ALLES zu löschen 
        await mongoClient.db('filmwebseite').collection('film').drop(); //im Skript NoSQl: MongoDB Befehle: deleteone um einen Eintrag auf der Webseite zu löschen
        break;
      default:
        response.statusCode = 404;
    }
    response.end();
  }
);

startServer();