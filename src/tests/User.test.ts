import request from "supertest"
import { User } from "../app/models/User.model"
import bcrypt from "bcryptjs"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import server from "./mocks/express.mock"

describe("UserController", () => {
    beforeAll(async () => {
        await User.deleteMany({
            email: "JIUzKLJhhjkJKh39DFf90fI1N@example.com",
        })
    })

    afterAll(async () => {
        await User.deleteMany({
            email: "JIUzKLJhhjkJKh39DFf90fI1N@example.com",
        })
    })

    it("should register a new user", async () => {
        const userData = {
            email: "JIUzKLJhhjkJKh39DFf90fI1N@example.com",
            password: "2Qj!@fj%89@N23fF89",
            confirmPassword: "2Qj!@fj%89@N23fF89",
            name: "Test User",
        }

        const response = await request(server)
            .post("/register")
            .send(userData)
            .expect(201)

        expect(response.body.message).toContain("Você está autenticado")
        expect(response.body.token).toBeDefined()

        const user = await User.findOne({ email: userData.email })
        expect(user).toBeTruthy()

        const isPasswordValid = await bcrypt.compare(
            userData.password,
            user!.password
        )
        expect(isPasswordValid).toBe(true)
    })

    it("should return 422 for duplicate email", async () => {
        const duplicateUserData = {
            email: "JIUzKLJhhjkJKh39DFf90fI1N@example.com",
            password: "2Qj!@fj%89@N23fF89",
            confirmPassword: "2Qj!@fj%89@N23fF89",
            name: "Duplicate User",
        }

        const response = await request(server)
            .post("/register")
            .send(duplicateUserData)
            .expect(422)

        expect(response.body.message).toContain(
            "Por favor, utilize outro e-mail"
        )
    })

    it("should return 422 for password mismatch", async () => {
        const mismatchedPasswordData = {
            email: "mismatched@example.com",
            password: "2Qj!@fj%89@N23fF89",
            confirmPassword: "2Qj!*!@&#¨&*3efds323fF89",
            name: "Mismatched User",
        }

        const response = await request(server)
            .post("/register")
            .send(mismatchedPasswordData)
            .expect(422)

        expect(response.body.message).toContain(
            "A confirmação de senha precisa ser igual a senha"
        )
    })
})
