import { Request, Response } from "express"
import { IAction } from "../interfaces/Action.interface"
import { Types } from "mongoose"
import { Goal } from "../models/Goal.model"
import { IGoal } from "../interfaces/Goal.interface"
import { Action } from "../models/Action.model"
import Logger from "../../configs/logger.config"

export default class ActionController {
    static async createByIdGoal(
        req: Request,
        res: Response
    ): Promise<Response> {
        const dataAction: IAction = req.body
        const idGoal: Types.ObjectId = new Types.ObjectId(req.params.idGoal)

        try {
            const goal: IGoal | null = await Goal.findById(idGoal)

            if (!goal) {
                Logger.warn("Objetivo não encontrado")

                return res
                    .status(404)
                    .json({ message: "Objetivo não encontrado" })
            }

            dataAction.goal = goal

            const action: IAction = await Action.create(dataAction)

            return res
                .status(201)
                .json({ message: "Execução criada com sucesso", action })
        } catch (error) {
            Logger.error(error)

            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }

    static async getAllByIdGoal(
        req: Request,
        res: Response
    ): Promise<Response> {
        const idGoal: Types.ObjectId = new Types.ObjectId(req.params.idGoal)

        try {
            const actions: IAction[] = await Action.find({
                "goal._id": idGoal,
            }).lean()

            if (actions.length === 0) {
                Logger.warn("Não foi encontrado nenhuma execução")

                return res
                    .status(404)
                    .json({ message: "Não foi encontrado nenhuma execução" })
            }

            return res.status(200).json({
                message: `Foram encontradas ${actions.length} execuções`,
                actions,
            })
        } catch (error) {
            Logger.error(error)

            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }

    static async getOneById(req: Request, res: Response): Promise<Response> {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id)

        try {
            const action: IAction | null = await Action.findById(id).lean()

            if (!action) {
                Logger.warn("Não foi encontrado a execução")

                return res
                    .status(404)
                    .json({ message: "Não foi encontrado a execução" })
            }

            return res.status(200).json({
                message: "Execução encontrada com sucesso",
                action,
            })
        } catch (error) {
            Logger.error(error)
            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }

    static async updateById(req: Request, res: Response): Promise<Response> {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id)
        const dataAction: IAction = req.body

        try {
            const action: IAction | null = await Action.findByIdAndUpdate(
                id,
                dataAction
            ).lean()

            if (!action) {
                Logger.warn("Não foi encontrado a execução")

                return res
                    .status(404)
                    .json({ message: "Não foi encontrado a execução" })
            }

            return res.status(200).json({
                message: "Execução atualizada com sucesso",
            })
        } catch (error) {
            Logger.error(error)
            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }

    static async deleteById(req: Request, res: Response): Promise<Response> {
        const id: Types.ObjectId = new Types.ObjectId(req.params.id)

        try {
            const action: IAction | null = await Action.findByIdAndDelete(
                id
            ).lean()

            if (!action) {
                Logger.warn("Não foi encontrado a execução")

                return res
                    .status(404)
                    .json({ message: "Não foi encontrado a execução" })
            }

            return res.status(200).json({
                message: "Execução apagada com sucesso",
            })
        } catch (error) {
            Logger.error(error)
            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }
}
