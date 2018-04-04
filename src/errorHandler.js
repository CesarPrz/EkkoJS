
class ErrorHandler {
    constructor (error) {
        if (error.response) {
            this.status = error.response.status
            this.message = error.response.statusText
        }
    }
}

module.exports = ErrorHandler;
