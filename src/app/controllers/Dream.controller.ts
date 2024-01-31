import { Request, Response } from "express"
import { Types } from "mongoose"
import { getUserByToken } from "../helpers/token.helper"
import { IDream } from "../interfaces/Dream.interface"
import { IUser } from "../interfaces/User.interface"
import { Action } from "../models/Action.model"
import { Dream } from "../models/Dream.model"
import { Goal } from "../models/Goal.model"
import Logger from "../../configs/logger.config"

export default class DreamController {
    static async getOneById(req: Request, res: Response): Promise<Response> {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id)

        try {
            const user: IUser | boolean = await getUserByToken(req, res)

            if (!user || typeof user === "boolean") {
                process.env.APP_ENV === "development" ||
                    Logger!.http("Acesso Negado!")

                return res.status(401).json({ message: "Acesso Negado!" })
            }

            const dream: IDream | null = await Dream.findOne({
                _id: id,
                "user._id": user._id,
            }).lean()

            if (!dream) {
                process.env.APP_ENV === "development" ||
                    Logger!.warn("Sonho não encontrado")

                return res.status(404).json({ message: "Sonho não encontrado" })
            }

            return res
                .status(200)
                .json({ message: "Sonho encontrado com sucesso", dream })
        } catch (error) {
            process.env.APP_ENV === "development" && Logger!.error(error)

            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }

    static async createByUserToken(
        req: Request,
        res: Response
    ): Promise<Response> {
        const dataDream: IDream = req.body

        try {
            const user: IUser | boolean = await getUserByToken(req, res)

            if (!user || typeof user === "boolean") {
                process.env.APP_ENV === "development" ||
                    Logger!.http("Acesso Negado!")

                return res.status(401).json({ message: "Acesso Negado!" })
            }

            dataDream.user = user

            const dream: IDream = await Dream.create(dataDream)

            if (!dream) {
                process.env.APP_ENV === "development" ||
                    Logger!.warn("Não foi possível criar o sonho")

                return res
                    .status(422)
                    .json({ message: "Não foi possível criar o sonho" })
            }

            return res.status(201).json({
                message: "Sonho criado com sucesso",
                dream,
            })
        } catch (error) {
            process.env.APP_ENV === "development" && Logger!.error(error)

            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }

    static async updateById(req: Request, res: Response): Promise<Response> {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id)
        const data: IDream = req.body

        try {
            const dream: IDream | null = await Dream.findOneAndUpdate(id, data)

            if (!dream) {
                process.env.APP_ENV === "development" ||
                    Logger!.warn("Sonho não encontrado")

                return res.status(404).json({ message: "Sonho não encontrado" })
            }

            return res
                .status(200)
                .json({ message: "Sonho atualizado com sucesso" })
        } catch (error) {
            process.env.APP_ENV === "development" && Logger!.error(error)

            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }

    static async deleteById(req: Request, res: Response): Promise<Response> {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id)

        try {
            const dream: IDream | null = await Dream.findOneAndDelete(id)

            if (!dream) {
                process.env.APP_ENV === "development" ||
                    Logger!.warn("Sonho não encontrado")

                return res.status(404).json({ message: "Sonho não encontrado" })
            }

            await Action.deleteMany({ "goal.dream._id": dream._id })

            await Goal.deleteMany({ "dream._id": dream._id })

            return res
                .status(200)
                .json({ message: "Sonho apagado com sucesso" })
        } catch (error) {
            process.env.APP_ENV === "development" && Logger!.error(error)

            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }
}
