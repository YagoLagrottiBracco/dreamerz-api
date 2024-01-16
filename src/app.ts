const cors = require("cors")
import express from "express"
import publicRoutes from "./routes/public.routes"
import privateRoutes from "./routes/private.routes"

const app = express()

app.use(express.json())
    .use(
        cors({
            credentials: true,
            origin: `http://localhost:${process.env.FRONT_PORT}`,
        })
    )
    .use(express.static("public"))
    .use("/", publicRoutes)
    .use("/dashboard/", privateRoutes)

export default app
