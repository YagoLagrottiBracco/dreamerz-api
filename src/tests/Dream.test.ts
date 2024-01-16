import request from "supertest"
import { Dream } from "../app/models/Dream.model"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import { User } from "../app/models/User.model"
import server from "./mocks/express.mock"

let dream: any
let user: any
let token: any

describe("DreamController()", () => {
    beforeAll(async () => {
        await Dream.deleteMany({
            name: "OiJIUzI1N",
        })

        await User.deleteMany({
            email: "OiJIUzI1N@example.com",
        })
    })

    afterAll(async () => {
        await Dream.deleteMany({
            name: "OiJIUzI1N",
        })

        await User.deleteMany({
            email: "OiJIUzI1N@example.com",
        })
    })

    const registerUser = async () => {
        return request(server).post("/register").send({
            name: "Test",
            email: "OiJIUzI1N@example.com",
            password: "2Qj!@fj%89@N23fF89",
            confirmPassword: "2Qj!@fj%89@N23fF89",
        })
    }

    it("should create a dream successfully", async () => {
        const dreamData = {
            name: "OiJIUzI1NI6IkpXVCJ9.eyJuYW1lIjo",
            description:
                "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo odio ipsa aliquam fuga quod, exercitationem nisi id, dolore libero voluptates voluptate. Magnam quibusdam cupiditate, consequuntur numquam ex ab fuga qui.",
        }

        user = await registerUser()

        token = user.body.token

        const response = await request(server)
            .post("/dashboard/dreams")
            .set({ Authorization: `Bearer ${token}` })
            .send(dreamData)
            .expect(201)

        dream = await Dream.findOne({
            name: dreamData.name,
        }).lean()

        expect(dream).toBeTruthy()
        expect(response.body.message).toContain("Sonho criado com sucesso")
        expect(response.body.dream).toBeDefined()
    })

    it("should find all dreams from the user's token", async () => {
        const response = await request(server)
            .get("/dashboard/dreams")
            .set({ Authorization: `Bearer ${token}` })
            .expect(200)

        expect(response.body.dreams).toHaveLength(1)
        expect(response.body.dreams[0].name).toBe(
            "OiJIUzI1NI6IkpXVCJ9.eyJuYW1lIjo"
        )
        expect(response.body.dreams[0].description).toBe(
            "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quo odio ipsa aliquam fuga quod, exercitationem nisi id, dolore libero voluptates voluptate. Magnam quibusdam cupiditate, consequuntur numquam ex ab fuga qui."
        )
        expect(response.body.message).toBe("Foram encontrados 1 sonhos")
    })

    it("should find one dream from the user's token and id of the dream", async () => {
        const response = await request(server)
            .get(`/dashboard/dreams/find/${dream._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(200)

        expect(response.body.dream.name).toBe(dream.name)
        expect(response.body.dream.description).toBe(dream.description)
        expect(response.body.message).toBe("Sonho encontrado com sucesso")
    })

    it("should edit one dream passing id as parameter and returning successfully", async () => {
        const dataDream = {
            name: "OiJIUzI1N",
            description: "Test Edit",
        }

        const response = await request(server)
            .patch(`/dashboard/dreams/${dream._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .send(dataDream)
            .expect(200)

        expect(response.body.message).toBe("Sonho atualizado com sucesso")
    })

    it("should delete one dream passing id as parameter and returning successfully", async () => {
        const response = await request(server)
            .delete(`/dashboard/dreams/${dream._id}`)
            .set({ Authorization: `Bearer ${token}` })
            .expect(200)

        expect(response.body.message).toBe("Sonho apagado com sucesso")
    })
})
