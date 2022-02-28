// https://github.com/JoshuaWise/better-sqlite3/blob/master/docs/api.md
import Database from 'better-sqlite3';
import type BetterSqlite3 from 'better-sqlite3';

import {z} from 'zod';
// import type BetterSqlite3 from 'better-sqlite3';  // @types/better-sqlite3

export function zodSafeParse (zObj :z.ZodObject<any,any,any>, args:any) { 
  let res = zObj.safeParse(args)
  if (res.success) return '';
  let msgArr = res.error.issues.map(e=>`- ${e.path.join('.')} : ${e.code} : ${e.message}`);
  let msg = `ZOD parse errors:\n${msgArr.join('\n')}`;
  return msg;
}

type DatabaseTypedResult<TOk> = {
  error: boolean,
  message: string,
  data: TOk
}

export default class DatabaseTyped extends Database {
  constructor(file:string) {
    super(file);
  }

  prepareSelect <TArg, TRow> (sql: string, ZIn?: z.ZodObject<any,any,any>)
    : {
      all: (argObj:TArg) => DatabaseTypedResult<TRow[]>,
    } 
    
  {
    let prep: BetterSqlite3.Statement<any[]>
    try {
      prep = this.prepare(sql);
    } catch (e:any) {
      throw new Error(`in 'prepareSelect' sql:\n${sql}\n${e.message}`)
    }

    return {

      all: (argObj:TArg) => {
        try { 
          // zod parse of input
          if (ZIn) {
            let zodMsg = zodSafeParse(ZIn, argObj);
            if (zodMsg) throw new Error(zodMsg)
          } 
          let retOk = { error: false, message:'', data: <TRow[]>prep.all(argObj) };
          return retOk; 
        } catch (e:any) {
          let retError = {
            error: true,
            message: e.message + '\nargs: ' + JSON.stringify(argObj) + '\nsql: ' + sql,
            data : <TRow[]>[]
          }
          return retError
        }
      },

    }
  } // prepareSelect



  /**
   * prepareRun: typed version of prepare, for insert, update, delete (run)
  */
  prepareRun <TArg> (sql: string, ZIn?: z.ZodObject<any,any,any>)
    : {
      run: (argObj:TArg) => DatabaseTypedResult<Database.RunResult>,
    } 
  {
    let prep: BetterSqlite3.Statement<any[]>
    try {
      prep = this.prepare(sql);
    } catch (e:any) {
      throw new Error(`in 'prepareRun' sql:\n${sql}\n${e.message}`)
    }

    return {

      run: (argObj:TArg) => {
        try { 
          // zod parse of input
          if (ZIn) {
            let zodMsg = zodSafeParse(ZIn, argObj);
            if (zodMsg) throw new Error(zodMsg)
          }   

          // -- run, may throw
          let retOk = { error: false, message:'', data: <Database.RunResult>prep.run(argObj) };

          // -- also throw if nothing found in delete, update
          if (retOk.data.changes === 0) { throw new Error('Not found')}
          return retOk; 
        } catch (e:any) {
          let retError = {
            error: true,
            message: e.message + '\nargs: ' + JSON.stringify(argObj) + '\nsql: ' + sql,
            data : <Database.RunResult>{}
          }
          return retError
        }
      },

    }
  } // prepareRun


}


/*
// -- EXAMPLE

const db = new DatabaseTyped('pets.db');   


let queryPersonGTAge = db.prepareTyped < 
    { age: number },  // query paramenters type
    { id_person:string, sex:string, age:number }  // row type
  > (`
  SELECT * from person where age > :age
`);

// -- run typed query
let rows = queryPersonGTAge.all({age:33}) // typed, compile error if bad parameters
console.log(rows);




// --- untyped query
let untypedQuery = db.prepare('SELECT * from person where age > :age');
let rows2 = untypedQuery.all({age:33});   // no compile error if bad parameters
console.log(rows2);


db.close();

*/




