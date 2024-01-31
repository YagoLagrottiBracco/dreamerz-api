const cors = require("cors")
import express from "express"
import serverless from "serverless-http"
import privateRoutes from "../src/routes/private.routes"
import publicRoutes from "../src/routes/public.routes"

const api = express()

api.use(express.json())
    .use(
        cors({
            credentials: true,
            origin: process.env.FRONT_URL,
        })
    )
    .use("/", publicRoutes)
    .use("/dashboard/", privateRoutes)

module.exports.handler = serverless(api)
