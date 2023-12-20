import { ErrorHandler } from "../Utils";
import { mkdir, readdir } from "fs/promises";
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

    static async craeteNewDatabaseHandler(dbName: string) {
        await Database.dbCreationHandler(dbName);
        return new Database(dbName, []);
    }
    private static async dbCreationHandler(dbName: string) {
        // This function is actally responsible for creating the database
        const dbPath = join(__dirname, `Databases/${dbName}`);
        const isExist = existsSync(dbPath);
        if (isExist) throw new Error(`Database "${dbName}" already exists`)
        await mkdir(dbPath);
    }
    // Loading all the existing databases complete
    static async loadAllDatabases() {
        const Path = join(__dirname, `Databases`);
        const Folders = await readdir(Path, { withFileTypes: true });
        const databases = Folders
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        return databases.map(async (database) => {
            const tables = await Table.loadAllTables(join(__dirname, `Databases`, database));
            return new Database(database, tables);
        })
    }
}