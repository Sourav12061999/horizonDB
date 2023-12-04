import { ErrorHandler } from "../Utils";


interface ISchema {
    [key: string]: "string" | "number" | "boolean";
}
class Tables extends ErrorHandler {
    constructor(tableName: string, schema: ISchema) {
        super();
    }

    private async tableCreationHandler() {

    }
}