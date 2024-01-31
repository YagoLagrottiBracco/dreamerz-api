const cors = require("cors")
import express from "express"
import privateRoutes from "./routes/private.routes"
import publicRoutes from "./routes/public.routes"

const app = express()

app.use(express.json())
    .use(
        cors({
            credentials: true,
            origin: `http://localhost:${process.env.FRONT_PORT}`,
        })
    )
    .use("/", publicRoutes)
    .use("/dashboard/", privateRoutes)

export default app
