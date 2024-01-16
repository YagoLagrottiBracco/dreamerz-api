import { Document, Types } from "mongoose"
import { IUser } from "./User.interface"

export interface IDream extends Document {
    _id: Types.ObjectId
    name: string
    description?: string | undefined | null
    active?: boolean
    user: IUser
    createdAt: Date
    updatedAt: Date
}
