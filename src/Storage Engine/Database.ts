import { ErrorHandler } from "../Utils";
import { mkdir, } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
export default class Database extends ErrorHandler {
    db: string;
    tables: string[];
    constructor(db: string) {
        super();
        this.db = db;
        this.tables = [];
        this.craeteNewDatabase();
    }

    private craeteNewDatabase() {
        // Here the Error handler will take care of any errors that happens while creating a database connection
        this.errorHandler(this.dbCreationHandler);
    }
    private async dbCreationHandler() {
        // This function is actally responsible for creating the database
        const dbPath = join(__dirname, `/Databases/${this.db}`);
        const isExist = existsSync(dbPath);
        if (isExist) throw new Error(`Database "${this.db}" already exists`)
        await mkdir(dbPath);
    }
}