import { ZodObject, z } from "zod";
import { ErrorHandler } from "../Utils";
import { join } from "path";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { BSON } from "bson";
import { DataOffsetRange } from "../global.types";
import { openSync, writeFileSync, closeSync, statSync, promises as fsPromise } from 'fs';

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
    schemas: ZodReturnType;
    dbPath: string;
    constructor(tableName: string, schema: ISchema, dbPath: string) {
        super();
        this.tableName = tableName;
        this.dbPath = dbPath;
        this.schemas = this.SchemaCreator(schema);
        this.tableCreationHandler();
    }

    async insertRow() { }
    async updateRow() { }

    private async tableCreationHandler() {
        const tablePath = join(this.dbPath, `${this.tableName}`);
        const isTableExists = existsSync(tablePath);
        if (isTableExists) throw new Error(`Database "${this.tableName}" already exists`);
        // Create the folder with the table name
        await fsPromise.mkdir(tablePath);
        // Create 3 files 1 for the acctual data, 1 for the index and 1 for some meta data around the database
        await fsPromise.writeFile(join(tablePath, "data.bson"), '');
        await fsPromise.writeFile(join(tablePath, "indexes.bson"), '');
        await fsPromise.writeFile(join(tablePath, "meta.bson"), '');
    }
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
    private async writeHandler(data: ISchema) {
        this.schemas.parse(data);
        const fileDescriptor = openSync(join(this.dbPath, `${this.tableName}`, `data.bson`), 'a+');
        const jsonData = JSON.stringify(data);
    }
    private async writeToMainFileHandler(data: ISchema) {
        const startOffset = (await fsPromise.stat(join(this.dbPath, `${this.tableName}`, `data.bson`))).size;
        const endOffset = (await fsPromise.stat(join(this.dbPath, `${this.tableName}`, `data.bson`))).size;

        const currentOffset: DataOffsetRange = [startOffset, endOffset];
        this.writeToIndexesHandler(currentOffset, 1);

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