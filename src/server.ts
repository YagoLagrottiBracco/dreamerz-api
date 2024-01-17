import "dotenv/config"
import db from "./configs/mongo.config"
import morganMiddleware from "./app/middlewares/morganMiddleware"
import app from "./app"

app.use(morganMiddleware)
app.listen(process.env.API_PORT, async () => {
    await db()
})

export default app
