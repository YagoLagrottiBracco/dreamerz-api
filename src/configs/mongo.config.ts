import mongoose from "mongoose"
import LoggerCreate from "./logger.config"

async function connect() {
    const env = process.env
    const dbInfo = {
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        cluster: env.DB_CLUSTER,
        database: env.DB_DATABASE,
    }

    const dbUri = `mongodb+srv://${dbInfo.user}:${dbInfo.password}@${dbInfo.cluster}.yo1vswf.mongodb.net/${dbInfo.database}?retryWrites=true&w=majority`

    try {
        await mongoose.connect(dbUri)
    } catch (error) {
        console.error(error)

        process.env.APP_ENV === "development" && LoggerCreate!.error(error)
    }
}

export default connect
