import { ZodObject, z } from "zod";
import { ErrorHandler } from "../Utils";
import { join } from "path";
import { existsSync } from "fs";
import { readFile, readdir } from "fs/promises";
import { BSON } from "bson";
import { DataOffsetRange } from "./types";
import { promises as fsPromise } from 'fs';
import { IBsonMetadata } from "./types";

interface ISchema {
    [key: string]: "string" | "number" | "boolean";
}
interface IZodSchema {
    [key: string]: z.ZodString | z.ZodNumber | z.ZodBoolean;
}

type ZodReturnType = ZodObject<IZodSchema, "strip", z.ZodTypeAny, {
    [x: string]: string | number | boolean;
}, {
    [x: string]: string | number | boolean;
}>;
export default class Table extends ErrorHandler {
    tableName: string;
    // schemas?: ZodReturnType;
    dbPath: string;
    private constructor(tableName: string, dbPath: string) {
        super();
        this.tableName = tableName;
        this.dbPath = dbPath;

    }

    // This method is to create a new Table
    static async createNewTable(tableName: string, schema: ISchema, dbPath: string) {
        const table = new Table(tableName, dbPath);
        await this.tableCreationHandler(schema, dbPath, tableName);
        return table;
    }
    //TODO This method will be called inside the createNewTable method it won't be used individually
    private static async tableCreationHandler(schema: ISchema, dbPath: string, tableName: string) {
        // this.schemas = this.SchemaCreator(schema);
        const tablePath = join(dbPath, `${tableName}`);
        const isTableExists = existsSync(tablePath);
        if (isTableExists) throw new Error(`Database "${tableName}" already exists`);
        // Create the folder with the table name
        await fsPromise.mkdir(tablePath);
        // Create 3 files 1 for the acctual data, 1 for the index and 1 for some meta data around the database
        await fsPromise.writeFile(join(tablePath, "data.bson"), '');
        await fsPromise.writeFile(join(tablePath, "indexes.bson"), '');
        const metaData: IBsonMetadata = {
            count: 0,
            indexes: []
        }
        // Creates the meta.bson file & stores the meta data in the file
        await fsPromise.writeFile(join(tablePath, "meta.bson"), BSON.serialize(metaData));
    }

    // This method will be called to load all the tables within the database 
    static async loadAllTables(dbPath: string) {
        const files = await readdir(dbPath, { withFileTypes: true });
        const tables = files
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        return tables.map((table) => {
            return new Table(table, dbPath);
        })

    }
    async insertRow() { }
    async updateRow() { }



    private async readHandler(): Promise<ISchema[]> {
        // Read existing data from the file
        // try {
        const tablePath = join(this.dbPath, `${this.tableName}.bson`);
        // Read existing data from the file
        const fileContent = await readFile(tablePath);
        // Deserialize the binary data
        const existingData = BSON.deserialize(fileContent) as ISchema[];
        return existingData;
        //    } catch (error) {

        //    }
    }
    async writeHandler(data: ISchema) {
        this.errorHandler(() => {
            // this.schemas?.parse(data);
            this.writeToMainFileHandler(data);
        });

    }
    private async writeToMainFileHandler(data: ISchema) {
        // Reading the meta data
        const bsonMeta = await fsPromise.readFile(join(this.dbPath, `${this.tableName}`, `meta.bson`));
        const meta = BSON.deserialize(bsonMeta);
        const count = meta.count;
        const startOffset = (await fsPromise.stat(join(this.dbPath, `${this.tableName}`, `data.bson`))).size; // The offset before appending the data

        // This will append the bson data in the file with the incoming data and a space to identify each doc seperately
        await fsPromise.appendFile(join(this.dbPath, `${this.tableName}`, `data.bson`), `${BSON.serialize(data)} `);
        const endOffset = (await fsPromise.stat(join(this.dbPath, `${this.tableName}`, `data.bson`))).size - 1; // The offset after appending the data
        const currentOffset: DataOffsetRange = [startOffset, endOffset]; // the range of offset in which the data exists
        await this.writeToIndexesHandler(currentOffset, count + 1);
        // When the insertion is complete increase the count by 1
        meta.count++;
        // Store the current count in the meta.bson file
        await fsPromise.writeFile(join(this.dbPath, `${this.tableName}`, `meta.bson`), BSON.serialize(meta));
    }

    private async writeToIndexesHandler(offset: DataOffsetRange, id: number) {

    }
    private SchemaCreator(schema: ISchema) {
        const ZodSchema: IZodSchema = {};
        for (let key in schema) {
            switch (schema[key]) {
                case "string":
                    ZodSchema[key] = z.string();
                    break;
                case "number":
                    ZodSchema[key] = z.number();
                    break;
                case "boolean":
                    ZodSchema[key] = z.boolean();
                    break;
            }
        }
        return z.object(ZodSchema);
    }
}