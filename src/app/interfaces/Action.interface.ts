import { Document, Types } from "mongoose"
import { IGoal, Difficulty } from "./Goal.interface"

export interface IAction extends Document {
    _id: Types.ObjectId
    name: string
    description?: string | undefined | null
    difficulty: Difficulty
    doneIn: Date
    active?: boolean
    goal: IGoal
    createdAt: Date
    updatedAt: Date
}
