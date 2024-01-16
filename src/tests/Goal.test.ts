import request from "supertest"
import { Goal } from "../app/models/Goal.model"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { Dream } from "../app/models/Dream.model"
import { User } from "../app/models/User.model"
import server from "./mocks/express.mock"

let goal: any
let dream: any
let user: any
let token: any

describe("GoalController()", () => {
    beforeAll(async () => {
        await Goal.deleteMany({
            name: "IUzI1NiIsIn",
        })

        await Dream.deleteMany({
            name: "IUzI1NiIsIn",
        })

        await User.deleteMany({
            email: "eyJuYW1lIjo@example.com",
        })
    })

    afterAll(async () => {
        await Goal.deleteMany({
            name: "IUzI1NiIsIn",
        })

        await Dream.deleteMany({
            name: "IUzI1NiIsInI6IkpXVCJ9.eyJuYW1lIjo",
        })

        await User.deleteMany({
            email: "eyJuYW1lIjo@example.com",
        })
    })

    const registerUser = async () => {
        return request(server).post("/register").send({
            name: "Test",
            email: "eyJuYW1lIjo@example.com",
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
                name: "IUzI1NiIsIn",
                description:
                    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure cumque, eligendi quibusdam, magnam possimus laboriosam natus vero cupiditate veritatis veniam ab! Illo consequatur minima ad repellendus hic impedit ipsum aut.",
            })
    }

    it("should create a goal successfully", async () => {
        user = await registerUser()
        dream = await registerDream(user)

        const goalData = {
            name: "IUzI1NiIsInI6IkpXVCJ9.eyJuYW1lIjo",
            description:
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo odio ipsa aliquam fuga quod, exercitationem nisi id, dolore libero voluptates voluptate. Magnam quibusdam cupiditate, consequuntur numquam ex ab fuga qui.",
            difficulty: "hard",
        }

        const response = await request(server)
            .post(`/dashboard/goals/${dream.body.dream._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send(goalData)
            .expect(201)

        goal = await Goal.findOne({
            name: goalData.name,
        }).lean()

        expect(goal).toBeTruthy()
        expect(response.body.message).toContain("Objetivo criado com sucesso")
        expect(response.body.goal).toBeDefined()
    })

    it("should find all goals from the dream's id", async () => {
        const response = await request(server)
            .get(`/dashboard/goals/${dream.body.dream._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(200)

        expect(response.body.goals).toHaveLength(1)
        expect(response.body.goals[0].name).toBe(
            "IUzI1NiIsInI6IkpXVCJ9.eyJuYW1lIjo"
        )
        expect(response.body.goals[0].description).toBe(
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo odio ipsa aliquam fuga quod, exercitationem nisi id, dolore libero voluptates voluptate. Magnam quibusdam cupiditate, consequuntur numquam ex ab fuga qui."
        )
        expect(response.body.goals[0].difficulty).toBe("hard")
        expect(response.body.message).toBe("Foram encontrados 1 objetivos")
    })

    it("should find one goal from the id of the goal and returning the goal", async () => {
        const response = await request(server)
            .get(`/dashboard/goals/find/${goal._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(200)

        expect(response.body.goal.name).toBe(goal.name)
        expect(response.body.goal.description).toBe(goal.description)
        expect(response.body.message).toBe("Objetivo encontrado com sucesso")
    })

    it("should edit one goal passing id as parameter and returning successfully", async () => {
        const dataGoal = {
            name: "IUzI1NiIsIn",
            description: "Test Edit",
            difficulty: "easy",
        }

        const response = await request(server)
            .patch(`/dashboard/goals/${goal._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send(dataGoal)
            .expect(200)

        expect(response.body.message).toBe("Objetivo atualizado com sucesso")
    })

    it("should delete one goal passing id as parameter and returning successfully", async () => {
        const response = await request(server)
            .delete(`/dashboard/goals/${goal._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(200)

        expect(response.body.message).toBe("Objetivo apagado com sucesso")
    })
})
