import morgan, { StreamOptions } from "morgan"
import LoggerCreate from "../../configs/logger.config"

const stream: StreamOptions = {
    write: (message) =>
        process.env.APP_ENV === "development" && LoggerCreate!.http(message),
}

const skip = () => {
    const env = process.env.APP_ENV || "development"

    return env !== "development"
}

const morganMiddleware = morgan(
    "METHOD(:method) URL(:url) STATUS(:status) RESPONSE(:res[content-length] content amount - :response-time ms)",
    { stream, skip }
)

export default morganMiddleware
