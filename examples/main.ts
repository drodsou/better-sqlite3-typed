import DatabaseTyped from '../better-sqlite3-typed';
import prepQuery from './query';

const dbPath = __dirname + '/db/test.db';
console.log(`• Opening sqlite db: ${dbPath}\n `);
const db = new DatabaseTyped(dbPath);   

// -- all 'actions' available in the bd
const query = prepQuery(db);


function print(r:any) {
  if (r.error || !Array.isArray(r.data)) { console.log(r) }
  else {console.table(r.data)}
}

// -- typed select
{
let r = query.selectGTAge.all({age:18}) // try -1 here to test Zod runtime check
print(r);
}


// --- untyped select
// {
// let qSelectUntyped = db.prepare('SELECT * from person where age > :age');
// let rows = qSelectUntyped.all({age:33});   // no compile error if bad parameters
// console.log(rows);
// }






// --- TODO: move this to query.ts

// // -- untyped insert
// {
// let qUntypedInsert = db.prepare(`insert into person (id_person, sex, age) values (:id_person, :sex, :age)`);
// try { 
//   let res = qUntypedInsert.run({id_person: 'Person1', sex:'X', age:'-2'}); 
//   console.log(res)
//   // { changes: 1, lastInsertRowid: 16 }  || throw
// } catch (e:any) { console.log('error inserting', e.message); }
// }

// -- typed insert
// {
//   let qInsertPerson = db.prepareRun 
//     <{id_person:string, sex:string, age:number}> 
//     (`insert into person (id_person, sex, age) values (:id_person, :sex, :age)`);
//   let res = qInsertPerson.run({id_person: 'Person4', sex:'X', age:-2}); 
//   console.log(res);
// }

// // -- typed update
// {
//   let qUpdatePerson = db.prepareRun 
//     <{id_person:string, sex:string, age:number, where_id_person:string }> 
//     (`
//       update person 
//       set id_person = :id_person, sex = :sex, age = :age
//       where id_person = :where_id_person
//     `);
//   let res = qUpdatePerson.run({
//     id_person: 'Person4', sex:'X', age: 5, 
//     where_id_person: 'Person41' 
//   }); 
//   console.log(res);
// }


// // -- typed delete
// {
//   let qDeletePerson = db.prepareRun 
//     <{where_id_person: string }> 
//     (`
//       delete from person 
//       where id_person = :where_id_person
//     `);
//   let res = qDeletePerson.run({
//     where_id_person: 'Person4' 
//   }); 
//   console.log(res);
// }





// --------------------
// -- ZOD
// --------------------

// function createQ (oz:ZodRawShape, sql:string) {
//   let zoz = z.object(oz);
//   type Tzoz = z.infer<typeof zoz>

//   return function (oArg: Tzoz ) {
//     let p = zoz.safeParse(oArg)
//     console.log('parse',p);
//     return sql;
//   }
// }




// let res = qDeletePerson.run({
//   where_id_person: '' 
// }); 
// console.log(res.message);

 






db.close();






