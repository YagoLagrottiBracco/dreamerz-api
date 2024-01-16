import { Request, Response } from "express"
import { Dream } from "../models/Dream.model"
import { getUserByToken } from "../helpers/token.helper"
import { IUser } from "../interfaces/User.interface"
import { IDream } from "../interfaces/Dream.interface"
import { Types } from "mongoose"

export default class DreamController {
    static async getAllByUserToken(
        req: Request,
        res: Response
    ): Promise<Response> {
        try {
            const user: IUser | boolean = await getUserByToken(req, res)

            if (!user || typeof user === "boolean") {
                return res.status(401).json({ message: "Acesso Negado!" })
            }

            const dreams: IDream[] = await Dream.find({
                "user._id": user._id,
            }).lean()

            if (dreams.length === 0) {
                return res
                    .status(404)
                    .json({ message: "Não foi encontrado nenhum sonho" })
            }

            return res.status(200).json({
                message: `Foram encontrados ${dreams.length} sonhos`,
                dreams,
            })
        } catch (error) {
            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }

    static async getOneById(req: Request, res: Response): Promise<Response> {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id)

        try {
            const user: IUser | boolean = await getUserByToken(req, res)

            if (!user || typeof user === "boolean") {
                return res.status(401).json({ message: "Acesso Negado!" })
            }

            const dream: IDream | null = await Dream.findOne({
                _id: id,
                "user._id": user._id,
            }).lean()

            if (!dream) {
                return res.status(404).json({ message: "Sonho não encontrado" })
            }

            return res
                .status(200)
                .json({ message: "Sonho encontrado com sucesso", dream })
        } catch (error) {
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
                return res.status(401).json({ message: "Acesso Negado!" })
            }

            dataDream.user = user

            const dream: IDream = await Dream.create(dataDream)

            return res.status(201).json({
                message: "Sonho criado com sucesso",
                dream,
            })
        } catch (error) {
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
                return res.status(404).json({ message: "Sonho não encontrado" })
            }

            return res
                .status(200)
                .json({ message: "Sonho atualizado com sucesso" })
        } catch (error) {
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
                return res.status(404).json({ message: "Sonho não encontrado" })
            }

            return res
                .status(200)
                .json({ message: "Sonho apagado com sucesso" })
        } catch (error) {
            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }
}
