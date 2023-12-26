// import grammar from "./grammar";
// import * as nearley from 'nearley';
const grammar = require("./grammar");
// import { Parser, Grammar } from "nearley";
const nearly = require("nearley");
function parseSQL(query: string) {
    console.log(query);
    
    const parser = new nearly.Parser(nearly.Grammar.fromCompiled(grammar as any));
    parser.feed(query);
    return parser.results;
}

// console.log(parseSQL("delete from students where id = 2")[0]);

export default parseSQL;