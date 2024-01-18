import { Router } from "express"
import UserController from "../app/controllers/User.controller"
import {
    UserValidationLogin,
    UserValidationProfile,
} from "../app/middlewares/userMiddleware"
import { validationMiddleware } from "../app/middlewares/validationMiddleware"

const router = Router()

router.post(
    "/register",
    UserValidationProfile(),
    validationMiddleware,
    UserController.register
)
router.post(
    "/login",
    UserValidationLogin(),
    validationMiddleware,
    UserController.login
)

export default router
