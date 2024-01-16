import request from "supertest"
import { Action } from "../app/models/Action.model"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { Goal } from "../app/models/Goal.model"
import { Dream } from "../app/models/Dream.model"
import { User } from "../app/models/User.model"
import server from "./mocks/express.mock"

let action: any
let goal: any
let dream: any
let user: any
let token: any

describe("ActionController()", () => {
    beforeAll(async () => {
        await Action.deleteMany({
            name: "OiUzIsInR",
        })

        await Goal.deleteMany({
            name: "OiUzIsInR",
        })

        await Dream.deleteMany({
            name: "OiUzIsInR",
        })

        await User.deleteMany({
            email: "kpXVCJ9.eyJuY@example.com",
        })
    })

    afterAll(async () => {
        await Action.deleteMany({
            name: "OiUzIsInR",
        })

        await Goal.deleteMany({
            name: "OiUzIsInR",
        })

        await Dream.deleteMany({
            name: "OiUzIsInR",
        })

        await User.deleteMany({
            email: "kpXVCJ9.eyJuY@example.com",
        })
    })

    const registerUser = async () => {
        return request(server).post("/register").send({
            name: "Test",
            email: "kpXVCJ9.eyJuY@example.com",
            password: "2Qj!@fj%89@N23fF89",
            confirmPassword: "2Qj!@fj%89@N23fF89",
        })
    }

    const registerDream = async (user: any) => {
        token = user.body.token

        return request(server)
            .post("/dashboard/dreams")
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "OiUzIsInR",
                description:
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure cumque, eligendi quibusdam, magnam possimus laboriosam natus vero cupiditate veritatis veniam ab! Illo consequatur minima ad repellendus hic impedit ipsum aut.",
            })
    }

    const registerGoal = async (dream: any) => {
        dream = dream.body.dream

        return request(server)
            .post(`/dashboard/goals/${dream._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send({
                name: "OiUzIsInR",
                description:
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure cumque, eligendi quibusdam, magnam possimus laboriosam natus vero cupiditate veritatis veniam ab! Illo consequatur minima ad repellendus hic impedit ipsum aut.",
                difficulty: "hard",
            })
    }

    it("should create a action successfully", async () => {
        user = await registerUser()
        dream = await registerDream(user)
        goal = await registerGoal(dream)

        const actionData = {
            name: "OiUzIsInRI6IkpXVCJ9.eyJuYW1lIjo",
            description:
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo odio ipsa aliquam fuga quod, exercitationem nisi id, dolore libero voluptates voluptate. Magnam quibusdam cupiditate, consequuntur numquam ex ab fuga qui.",
            difficulty: "hard",
            doneIn: "2024-01-20",
        }

        const response = await request(server)
            .post(`/dashboard/actions/${goal.body.goal._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send(actionData)
            .expect(201)

        action = await Action.findOne({
            name: actionData.name,
        }).lean()

        expect(action).toBeTruthy()
        expect(response.body.message).toContain("Execução criada com sucesso")
        expect(response.body.action).toBeDefined()
    })

    it("should find all actions from the goal's id", async () => {
        const response = await request(server)
            .get(`/dashboard/actions/${goal.body.goal._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(200)

        expect(response.body.actions).toHaveLength(1)
        expect(response.body.actions[0].name).toBe(action.name)
        expect(response.body.actions[0].description).toBe(action.description)
        expect(response.body.actions[0].difficulty).toBe("hard")
        expect(response.body.actions[0].doneIn).toBe("2024-01-20T00:00:00.000Z")
        expect(response.body.message).toBe("Foram encontradas 1 execuções")
    })

    it("should find one action from the id of the action and returning the action", async () => {
        const response = await request(server)
            .get(`/dashboard/actions/find/${action._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(200)

        expect(response.body.action.name).toBe(action.name)
        expect(response.body.action.description).toBe(action.description)
        expect(response.body.message).toBe("Execução encontrada com sucesso")
    })

    it("should edit one action passing id as parameter and returning successfully", async () => {
        const dataAction = {
            name: "OiUzIsInR",
            description: "Test Edit",
            difficulty: "medium",
            doneIn: "2024-04-20",
        }

        const response = await request(server)
            .patch(`/dashboard/actions/${action._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send(dataAction)
            .expect(200)

        expect(response.body.message).toBe("Execução atualizada com sucesso")
    })

    it("should delete one action passing id as parameter and returning successfully", async () => {
        const response = await request(server)
            .delete(`/dashboard/actions/${action._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(200)

        expect(response.body.message).toBe("Execução apagada com sucesso")
    })
})
