class AppError extends Error {
    constructor (
        public message: string,
        public statusCode: number,
        public readonly operational = true
    ) {
        super(message)
        Error.captureStackTrace(this)
    }
}

export default AppError