import express from "express"
import { askToAssistant, getCurrentUser, updateassistant } from "../controllers/user.controlers.js"
import isAuth from "../middleware/isAuth.js"
import upload from "../middleware/multer.js"
 
const userRouter = express.Router()
 
userRouter.get("/current",isAuth,getCurrentUser)
userRouter.post("/update",isAuth,upload.single("assistantImage"),updateassistant)
userRouter.post("/asktoassistant",isAuth,askToAssistant)

export default userRouter