/** Database connection for messagely. */


const { Client } = require("pg");
const { DB_URI } = require("./config");

const client = new Client(DB_URI);

console.log(`Connecting to ${DB_URI}`)
client.connect();


module.exports = client;
