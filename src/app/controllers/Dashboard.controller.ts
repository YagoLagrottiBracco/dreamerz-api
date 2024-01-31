import { Request, Response } from "express"
import { getUserByToken } from "../helpers/token.helper"
import { IAction } from "../interfaces/Action.interface"
import { IDream } from "../interfaces/Dream.interface"
import { IGoal } from "../interfaces/Goal.interface"
import { IUser } from "../interfaces/User.interface"
import { Action } from "../models/Action.model"
import { Dream } from "../models/Dream.model"
import { Goal } from "../models/Goal.model"
import LoggerCreate from "../../configs/logger.config"

export default class DashboardController {
    static async getAllDreamsWithGoalsAndActions(req: Request, res: Response) {
        try {
            const user: IUser | boolean = await getUserByToken(req, res)
            let dreamsWithGoalsAndActions: any[] = []

            if (!user || typeof user === "boolean") {
                process.env.APP_ENV === "development" &&
                    LoggerCreate!.http("Acesso Negado!")
                return res.status(401).json({ message: "Acesso Negado!" })
            }

            const dreams: IDream[] = await Dream.find({
                "user._id": user._id,
            }).lean()

            if (dreams.length === 0) {
                process.env.APP_ENV === "development" &&
                    LoggerCreate!.warn("Não foi encontrado nenhum sonho")
                return res
                    .status(404)
                    .json({ message: "Não foi encontrado nenhum sonho" })
            }

            for (const dream of dreams) {
                const dreamGoals: IGoal[] = await Goal.find({
                    "dream._id": dream._id,
                }).lean()
                const goalsWithActions: any[] = []

                for (const goal of dreamGoals) {
                    const goalActions: IAction[] = await Action.find({
                        "goal._id": goal._id,
                    }).lean()
                    goalsWithActions.push({ ...goal, actions: goalActions })
                }

                dreamsWithGoalsAndActions.push({
                    ...dream,
                    goals: goalsWithActions,
                })
            }

            return res.status(200).json({
                message: `Foram encontrados ${dreams.length} sonhos`,
                dreams: dreamsWithGoalsAndActions,
            })
        } catch (error) {
            process.env.APP_ENV === "development" && LoggerCreate!.error(error)
            return res.status(500).json({
                message: "Há um erro, volte novamente mais tarde",
                error,
            })
        }
    }
}
