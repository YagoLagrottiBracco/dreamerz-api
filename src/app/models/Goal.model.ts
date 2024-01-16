import { model, Schema } from "mongoose"
import { IGoal, Difficulty } from "../interfaces/Goal.interface"

export const Goal = model(
    "Goal",
    new Schema<IGoal>(
        {
            name: { type: String, required: true },
            description: { type: String },
            difficulty: {
                type: String,
                enum: Object.values(Difficulty),
                required: true,
            },
            active: { type: Boolean, default: true },
            dream: Object,
        },
        { timestamps: true }
    )
)
