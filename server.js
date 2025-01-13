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
    response.setHeader("Access-Control-Allow-Headers", "*"); // Erlaubt das Empfangen von Requests mit Headern, z. B. Content-Type */
    response.setHeader("Access-Control-Allow-Methods", "*"); // Erlaubt alle HTTP-Methoden */

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
          
            case 'POST': //neuen film hinmzufügen 
            let jsonString = '';
            request.on('data', data => {
              jsonString += data; //entnimmt alle Daten entgegen und addiert sie
            });
            request.on('end', async () => {
              filmCollection.insertOne(JSON.parse(jsonString)); //wird wieder zum Objekt und speichert direkt in die Datenbank
            });
            break;
          
            case 'PUT': // Film bearbeiten
          let putData = '';
          request.on('data', chunk => { putData += chunk; });
          request.on('end', async () => {
            const { id, ...updatedData } = JSON.parse(putData); // id und neue Daten entnehmen
            const result = await filmCollection.updateOne({ _id: new mongodb.ObjectId(id) }, { $set: updatedData });
            response.write(JSON.stringify({ message: 'Film aktualisiert!', modifiedCount: result.modifiedCount }));
            response.end();
          });
          return;

        case 'DELETE': // Film löschen
          const deleteId = url.searchParams.get('id'); // ID aus der URL entnehmen
          if (deleteId) {
            const result = await filmCollection.deleteOne({ _id: new mongodb.ObjectId(deleteId) });
            response.write(JSON.stringify({ message: 'Film gelöscht!', deletedCount: result.deletedCount }));
          } else {
            response.statusCode = 400; // Fehlerhafte Anfrage
            response.write(JSON.stringify({ error: 'ID für Löschung erforderlich!' }));
          }
          break;

        default:
          response.statusCode = 405; // Methode nicht erlaubt
          response.write(JSON.stringify({ error: 'Methode nicht unterstützt!' }));
      }
        
          
        //}
        break;
      }
      /*case '/clearAll': //wenn es eine Option gäbe um ALLES zu löschen 
        await mongoClient.db('filmwebseite').collection('film').drop(); //im Skript NoSQl: MongoDB Befehle: deleteone um einen Eintrag auf der Webseite zu löschen
        break;
      default:
        response.statusCode = 404;*/
    }
    response.end();
  }
);

startServer();