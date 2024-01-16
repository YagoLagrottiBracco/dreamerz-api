import "dotenv/config"
import db from "./configs/mongo.config"

import app from "./app"

app.listen(process.env.API_PORT, async () => {
    await db()
})

export default app
