import express from "express";
export const routerChats = express.Router();
import { getChats } from "../controllers/chatsController";
routerChats.get("/chatsUser/:id",getChats);