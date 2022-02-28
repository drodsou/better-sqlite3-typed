import DatabaseTyped from '../better-sqlite3-typed';
import {z} from 'zod';
import {TablePersonZ, TablePerson} from './schema';

/**
 * Agregated, all prepared on startup to check for syntax errors in SQLs
*/
export default function prepQuery (db: DatabaseTyped) {
  const query = {
    deletePerson: prepDeletePerson(db),
    selectGTAge: prepSelectGTAge(db),
  }
  return query;
}

// ------------------------- QUERIES


function prepSelectGTAge (db: DatabaseTyped) {

  let ZIn = z.object({
    age: z.number().min(0)
  })
  type TIn = z.infer<typeof ZIn>

  type TOut = TablePerson;

  return db.prepareSelect <TIn, TOut> (`
    select * from person 
    where cast(strftime('%Y','now') as INTEGER) - :age >= year;
  `, ZIn); // Zod parse
}





// -- typed delete
function prepDeletePerson (db: DatabaseTyped) {

  let ZIn = z.object({
    name: TablePersonZ.name
  })
  type TIn = z.infer<typeof ZIn>

  return db.prepareRun <TIn> (`
    delete from person 
    where name = :name
  `, ZIn); // with zod parse
}




