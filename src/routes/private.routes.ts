import { Router } from "express"
import DreamController from "../app/controllers/Dream.controller"
import UserController from "../app/controllers/User.controller"
import { UserValidationProfile } from "../app/middlewares/userMiddleware"
import { validationMiddleware } from "../app/middlewares/validationMiddleware"
import {
    dreamValidationCreate,
    dreamValidationGetOneById,
    dreamValidationUpdate,
} from "../app/middlewares/dreamMiddleware"
import GoalController from "../app/controllers/Goal.controller"
import {
    goalValidationCreate,
    goalValidationGetOneById,
    goalValidationUpdate,
} from "../app/middlewares/goalMiddleware"
import {
    actionValidationCreate,
    actionValidationGetOneById,
    actionValidationUpdate,
} from "../app/middlewares/actionMiddleware"
import ActionController from "../app/controllers/Action.controller"

const router = Router()

//DREAMS
router.get("/dreams", DreamController.getAllByUserToken)
router.get(
    "/dreams/find/:id",
    dreamValidationGetOneById(),
    validationMiddleware,
    DreamController.getOneById
)
router.post(
    "/dreams",
    dreamValidationCreate(),
    validationMiddleware,
    DreamController.createByUserToken
)
router.patch(
    "/dreams/:id",
    dreamValidationUpdate(),
    validationMiddleware,
    DreamController.updateById
)
router.delete("/dreams/:id", DreamController.deleteById)

//GOALS
router.get("/goals/:idDream", GoalController.getAllByIdDream)
router.get(
    "/goals/find/:id",
    goalValidationGetOneById(),
    validationMiddleware,
    GoalController.getOneById
)
router.post(
    "/goals/:idDream",
    goalValidationCreate(),
    validationMiddleware,
    GoalController.createByIdDream
)
router.patch(
    "/goals/:id",
    goalValidationUpdate(),
    validationMiddleware,
    GoalController.updateById
)
router.delete("/goals/:id", GoalController.deleteById)

//ACTIONS
router.get("/actions/:idGoal", ActionController.getAllByIdGoal)
router.get(
    "/actions/find/:id",
    actionValidationGetOneById(),
    validationMiddleware,
    ActionController.getOneById
)
router.post(
    "/actions/:idGoal",
    actionValidationCreate(),
    validationMiddleware,
    ActionController.createByIdGoal
)
router.patch(
    "/actions/:id",
    actionValidationUpdate(),
    validationMiddleware,
    ActionController.updateById
)
router.delete("/actions/:id", ActionController.deleteById)

//USERS
router.get("/user/profile/", UserController.profile)
router.patch(
    "/user/profile/:id",
    UserValidationProfile(),
    validationMiddleware,
    UserController.update
)

export default router
