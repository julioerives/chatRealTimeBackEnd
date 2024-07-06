import express from "express";
import { getGrupos,getDataGroups } from "../controllers/gruposPublicosController";
export const routerGruposPublicos = express.Router();
routerGruposPublicos.get('/getGroups/:id',getGrupos);
routerGruposPublicos.get('/getGroup/:id',getDataGroups)