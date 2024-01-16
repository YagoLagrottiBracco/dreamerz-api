import { model, Schema } from "mongoose"
import { IAction } from "../interfaces/Action.interface"
import { Difficulty } from "../interfaces/Goal.interface"

export const Action = model(
    "Action",
    new Schema<IAction>(
        {
            name: { type: String, required: true },
            description: { type: String },
            difficulty: {
                type: String,
                enum: Object.values(Difficulty),
                required: true,
            },
            doneIn: { type: Date, required: true },
            active: { type: Boolean, default: true },
            goal: Object,
        },
        { timestamps: true }
    )
)
