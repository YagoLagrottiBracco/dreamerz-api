import { model, Schema } from "mongoose"

export const Dream = model(
    "Dream",
    new Schema(
        {
            name: { type: String, required: true },
            description: { type: String },
            active: { type: Boolean, default: true },
            user: { type: Object, required: true },
        },
        { timestamps: true }
    )
)
