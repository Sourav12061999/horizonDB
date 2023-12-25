import grammar  from "./grammar";
import * as nearley from 'nearley';
function parseSQL(query: string) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
    parser.feed(query);
    return parser.results[0];
}

console.log(parseSQL("delete from students where id = 2")[0]);

export default parseSQL;