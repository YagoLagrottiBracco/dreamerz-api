import { body, param } from "express-validator"

export const goalValidationCreate = () => {
    return [
        body("name").isString().withMessage("O nome é obrigatório"),
        body("difficulty")
            .isIn(["hard", "medium", "easy"])
            .withMessage("A dificuldade é obrigatória"),
    ]
}

export const goalValidationUpdate = () => {
    return [
        param("id").isMongoId().withMessage("ID não está correto"),
        body("name").isString().withMessage("O nome é obrigatório"),
        body("difficulty")
            .isIn(["hard", "medium", "easy"])
            .withMessage("A dificuldade é obrigatória"),
    ]
}

export const goalValidationGetOneById = () => {
    return [param("id").isMongoId().withMessage("ID não está correto")]
}
