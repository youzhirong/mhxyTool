import Datastore from 'nedb';

const db = new Datastore({ filename: './data.db', autoload: true });

export default db;