# better-sqlite3-typed

Wrapper of [better-sqlite3](https://github.com/JoshuaWise/better-sqlite3) and [Zod](https://github.com/colinhacks/zod), providing methods and patterns to build both type safe (compile time) and validated (run time) SQLite SQL queries

## better-sqlite3-typed.ts

Provides TWO additional methods:

- `db.prepareSelect <TIn, TOut> (sql, ZIn)` returns `.all (args: TIn) => TOut[]`

- `db.prepareRun <TIn> (sql, ZIn)` returns `.run (args: TIn) => RunResult`

where:
 - ZIn: Zod object with runtime type check of prepared statement parameters
 - TIn: type of the parameters of the prepared statement (derived from ZIn)
 - TOut: type of rows returned by the query


 ## example

 Example use pattern of those functions: `/examples/main.ts`

 run `npm run example`

 
