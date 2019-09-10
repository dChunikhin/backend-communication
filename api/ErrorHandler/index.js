interface IErrorHandler {
    handlers: any[];
    handle: (response: any) => any;
}

export default class ErrorHandler implements IErrorHandler {
    private handlers: any[] = [];
    private handle: (response: any) => any;
    constructor(handlers: any[] = []) {
        this.handlers = handlers;
        this.handle = this.handleResponse;
    }
    public addHandler(handler) {
        this.handlers.push(handler);
        return this;
    }
    public handleResponse(response) {
        this.handlers.forEach((handler: any) => {
            return handler(response);
        });
        return response;
    }
}
