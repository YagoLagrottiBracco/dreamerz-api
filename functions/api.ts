const cors = require("cors")
const fs = require("fs")
const path = require("path")
import express from "express"
import serverless from "serverless-http"
import privateRoutes from "../src/routes/private.routes"
import publicRoutes from "../src/routes/public.routes"

fs.exists(path.join(__dirname, "logs"), (exists: boolean) =>
    !exists ? null : fs.mkdirSync(path.join(__dirname, "logs"))
)

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
