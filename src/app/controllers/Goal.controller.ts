import { Request, Response } from "express"
import { Types } from "mongoose"
import Logger from "../../configs/logger.config"
import { IDream } from "../interfaces/Dream.interface"
import { IGoal } from "../interfaces/Goal.interface"
import { Action } from "../models/Action.model"
import { Dream } from "../models/Dream.model"
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
                process.env.APP_ENV === "development" ||
                    Logger.http("Sonho não encontrado")

                return res.status(404).json({ message: "Sonho não encontrado" })
            }

            dataGoal.dream = dream

            const goal: IGoal = await Goal.create(dataGoal)

            if (!goal) {
                process.env.APP_ENV === "development" ||
                    Logger.warn("Não possível criar o objetivo")

                return res
                    .status(422)
                    .json({ message: "Não foi possível criar o objetivo" })
            }

            return res
                .status(201)
                .json({ message: "Objetivo criado com sucesso", goal })
        } catch (error) {
            process.env.APP_ENV === "development" || Logger.error(error)

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
                process.env.APP_ENV === "development" ||
                    Logger.warn("Não foi encontrado nenhum objetivo")

                return res
                    .status(404)
                    .json({ message: "Não foi encontrado nenhum objetivo" })
            }

            return res.status(200).json({
                message: `Foram encontrados ${goals.length} objetivos`,
                goals,
            })
        } catch (error) {
            process.env.APP_ENV === "development" || Logger.error(error)

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
                process.env.APP_ENV === "development" ||
                    Logger.warn("Não foi encontrado o objetivo")

                return res
                    .status(404)
                    .json({ message: "Não foi encontrado o objetivo" })
            }

            return res.status(200).json({
                message: "Objetivo encontrado com sucesso",
                goal,
            })
        } catch (error) {
            process.env.APP_ENV === "development" || Logger.error(error)

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
            const goal = await Goal.findById(id).lean()
            dataGoal.dream = goal!.dream

            await Goal.findByIdAndUpdate(id, dataGoal)

            return res.status(200).json({
                message: "Objetivo atualizado com sucesso",
            })
        } catch (error) {
            process.env.APP_ENV === "development" || Logger.error(error)
            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }

    static async deleteById(req: Request, res: Response): Promise<Response> {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id)

        try {
            const goal: IGoal | null = await Goal.findByIdAndDelete(id).lean()

            if (!goal) {
                process.env.APP_ENV === "development" ||
                    Logger.warn("Objetivo não encontrado")

                return res
                    .status(404)
                    .json({ message: "Não foi encontrado o objetivo" })
            }

            await Action.deleteMany({ "goal.dream._id": goal.dream._id })

            return res.status(200).json({
                message: "Objetivo apagado com sucesso",
            })
        } catch (error) {
            process.env.APP_ENV === "development" || Logger.error(error)

            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }
}
