export default abstract class ErrorHandler {
    protected async errorHandler(cb: Function) {
        try {
            await cb();
        } catch (error) {
            this.printError(error);
        }
    }
    private printError(error: unknown): void {
        if (typeof error === "string") {
            console.log(error);
        } else {
            console.log(JSON.stringify(error));
        }
    }
}