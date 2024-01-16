import { body, param } from "express-validator"

export const actionValidationCreate = () => {
    return [
        body("name").isString().withMessage("O nome é obrigatório"),
        body("difficulty")
            .isIn(["hard", "medium", "easy"])
            .withMessage("A dificuldade é obrigatória"),
        body("doneIn")
            .isISO8601()
            .withMessage("A data de término é obrigatória"),
    ]
}

export const actionValidationUpdate = () => {
    return [
        param("id").isMongoId().withMessage("ID não está correto"),
        body("name").isString().withMessage("O nome é obrigatório"),
        body("difficulty")
            .isIn(["hard", "medium", "easy"])
            .withMessage("A dificuldade é obrigatória"),
        body("doneIn")
            .isISO8601()
            .withMessage("A data de término é obrigatória"),
    ]
}

export const actionValidationGetOneById = () => {
    return [param("id").isMongoId().withMessage("ID não está correto")]
}
