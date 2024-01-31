const cors = require("cors")
import express from "express"
import serverless from "serverless-http"
import db from "../src/configs/mongo.config"
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

db()
    .then(() => {
        console.log("Conectado ao banco de dados MongoDB")
    })
    .catch((error) => {
        console.error("Erro ao conectar ao banco de dados MongoDB:", error)
    })

module.exports.handler = serverless(api)
