import "dotenv/config"
import db from "../../configs/mongo.config"

import app from "../../app"

const server = app.listen(0, async () => {
    await db()
})

export default server
