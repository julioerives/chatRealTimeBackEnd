import express from "express";
export const routerUsers = express.Router();
import { register,login,addFriend,getUser,getAllUsers,getFriends } from "../controllers/userControllers";
routerUsers.post("/register",register);
routerUsers.post("/login",login);
routerUsers.post("/addFriend",addFriend);
routerUsers.get("/user/:id",getUser)
routerUsers.get("/user",getAllUsers)
routerUsers.get("/friends",getFriends)