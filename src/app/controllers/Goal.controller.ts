import { Request, Response } from "express"
import { IGoal } from "../interfaces/Goal.interface"
import { Types } from "mongoose"
import { Dream } from "../models/Dream.model"
import { IDream } from "../interfaces/Dream.interface"
import { Goal } from "../models/Goal.model"

export default class GoalController {
    static async createByIdDream(
        req: Request,
        res: Response
    ): Promise<Response> {
        const dataGoal: IGoal = req.body
        const idDream: Types.ObjectId = new Types.ObjectId(req.params.idDream)

        try {
            const dream: IDream | null = await Dream.findById(idDream)

            if (!dream) {
                return res.status(404).json({ message: "Sonho não encontrado" })
            }

            dataGoal.dream = dream

            const goal: IGoal = await Goal.create(dataGoal)

            return res
                .status(201)
                .json({ message: "Objetivo criado com sucesso", goal })
        } catch (error) {
            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }

    static async getAllByIdDream(
        req: Request,
        res: Response
    ): Promise<Response> {
        const idDream: Types.ObjectId = new Types.ObjectId(req.params.idDream)

        try {
            const goals: IGoal[] = await Goal.find({
                "dream._id": idDream,
            }).lean()

            if (goals.length === 0) {
                return res
                    .status(404)
                    .json({ message: "Não foi encontrado nenhum objetivo" })
            }

            return res.status(200).json({
                message: `Foram encontrados ${goals.length} objetivos`,
                goals,
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
            const goal: IGoal | null = await Goal.findById(id).lean()

            if (!goal) {
                return res
                    .status(404)
                    .json({ message: "Não foi encontrado o objetivo" })
            }

            return res.status(200).json({
                message: "Objetivo encontrado com sucesso",
                goal,
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
        const dataGoal: IGoal = req.body

        try {
            await Goal.findByIdAndUpdate(id, dataGoal).lean()

            return res.status(200).json({
                message: "Objetivo atualizado com sucesso",
            })
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
            await Goal.findByIdAndDelete(id).lean()

            return res.status(200).json({
                message: "Objetivo apagado com sucesso",
            })
        } catch (error) {
            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }
}
