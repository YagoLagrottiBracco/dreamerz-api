const cors = require("cors")
import express from "express"
import serverless from "serverless-http"
import db from "../src/configs/mongo.config"
import privateRoutes from "../src/routes/private.routes"
import publicRoutes from "../src/routes/public.routes"

const api = express()

console.error("teste1")

api.use(express.json())
    .use(
        cors({
            credentials: true,
            origin: process.env.FRONT_URL,
        })
    )
    .use("/", publicRoutes)
    .use("/dashboard/", privateRoutes)

db()

module.exports.handler = serverless(api)
