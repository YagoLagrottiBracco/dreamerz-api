import fs from "fs"
import path from "path"
import winston from "winston"

const logsDir = path.join(__dirname, "logs")
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir)
}

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
}

const level = (): string => {
    const env = process.env.APP_ENV || "development"
    const isDevelopment = env === "development"

    return isDevelopment ? "debug" : "warn"
}

const colors = {
    error: "red",
    warn: "yellow",
    info: "blue",
    http: "magenta",
    debug: "green",
}

winston.addColors(colors)

const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} - ${info.level}: ${info.message}`
    )
)

const transports = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: path.join(logsDir, "errors.log"),
        level: "error",
    }),
    new winston.transports.File({
        filename: path.join(logsDir, "warnings.log"),
        level: "warn",
    }),
    new winston.transports.File({
        filename: path.join(logsDir, "defaults.log"),
    }),
]

const Logger = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
})

export default Logger
