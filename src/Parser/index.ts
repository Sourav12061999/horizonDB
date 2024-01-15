// import grammar from "./grammar";
// import * as nearley from 'nearley';
const grammar = require("./grammar");
// import { Parser, Grammar } from "nearley";
const nearly = require("nearley");


class Parser {


    static parseSQL(query: string) {
        console.log(query);

        const parser = new nearly.Parser(nearly.Grammar.fromCompiled(grammar as any));
        parser.feed(query);
        return parser.results;
    }

    // console.log(parseSQL("delete from students where id = 2")[0]);

    static createDatabase(ast: any): string {
        if (!ast?.name?.value) {
            throw new Error("Syntax error in create database");
        }
        return ast.name.value
    }

    static createTable(ast: any) {

    }

    static useDatabase(ast: any) {
        if (!ast?.name?.value) {
            throw new Error("Syntax error in use database");
        }
        return ast.name.value
    }

    static updateDatabase(ast: any) { }

    static deleteDatabase(ast: any) { }

    static getDatabase(ast: any) {
        if (!ast?.table_exp?.from?.table_refs[0]?.table) {
            throw new Error("Syntax error in select");
        }

        return !ast?.table_exp?.from?.table_refs[0]?.table

    }
}

export default Parser;