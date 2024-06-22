import express from "express";
export const routerChats = express.Router();
import { getChats,insertChats } from "../controllers/chatsController";
routerChats.get("/chatsUser/:id",getChats);
routerChats.post("/chatsUser",insertChats)