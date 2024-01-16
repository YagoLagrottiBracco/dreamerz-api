import { Document, Types } from "mongoose"
import { IDream } from "./Dream.interface"

export interface IGoal extends Document {
    _id: Types.ObjectId
    name: string
    description?: string | undefined | null
    difficulty: Difficulty
    active?: boolean
    dream: IDream
    createdAt: Date
    updatedAt: Date
}

export enum Difficulty {
    Easy = "easy",
    Medium = "medium",
    Hard = "hard",
}
