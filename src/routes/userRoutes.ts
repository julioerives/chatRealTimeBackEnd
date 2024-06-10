import express from "express";
export const routerUsers = express.Router();
import { register,login,addFriend } from "../controllers/userControllers";
routerUsers.post("/register",register);
routerUsers.post("/login",login);
routerUsers.post("/addFriend",addFriend);