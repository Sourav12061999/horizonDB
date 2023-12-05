import { ZodObject, z } from "zod";
import { ErrorHandler } from "../Utils";
import { join } from "path";
import { existsSync } from "fs";

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
    schemas: ZodReturnType
    constructor(tableName: string, schema: ISchema, dbPath: string) {
        super();
        this.tableName = tableName;
        this.schemas = this.SchemaCreator(schema);
        this.tableCreationHandler(dbPath);
    }

    private async tableCreationHandler(dbPath: string) {
        const tablePath = join(dbPath, `${this.tableName}.bson`);
        const isTableExists = existsSync(tablePath);
        if (isTableExists) throw new Error(`Database "${this.tableName}" already exists`);
    }

    private SchemaCreator(schema: ISchema) {
        const ZodSchema: IZodSchema = {};
        for (let key in schema) {
            switch (schema[key]) {
                case "string":
                    ZodSchema[key] = z.string();
                case "number":
                    ZodSchema[key] = z.number();
                case "boolean":
                    ZodSchema[key] = z.boolean();
            }
        }
        return z.object(ZodSchema);
    }

}