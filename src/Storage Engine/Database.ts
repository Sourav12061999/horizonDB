import { ErrorHandler } from "../Utils";
import { mkdir, } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import Table from "./Tables";
export default class Database extends ErrorHandler {
    db: string = "";
    tables: Table[] = [];
    private constructor(db: string, tables: Table[]) {
        super();
        this.tables = tables;
        this.db = db;

    }

    private craeteNewDatabaseHandler() {
        // Here the Error handler will take care of any errors that happens while creating a database connection
        this.errorHandler(this.dbCreationHandler);
    }
    private async dbCreationHandler() {
        // This function is actally responsible for creating the database
        const dbPath = join(__dirname, `Databases/${this.db}`);
        const isExist = existsSync(dbPath);
        if (isExist) throw new Error(`Database "${this.db}" already exists`)
        await mkdir(dbPath);
    }

    static createNewDatabase(dbPath: string) {

    }

    static loadAllDatabases() {

    }
}