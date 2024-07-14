import express from "express";
import { getGrupos,getDataGroups, createGroup } from "../controllers/gruposPublicosController";
export const routerGruposPublicos = express.Router();
routerGruposPublicos.get('/getGroups/:id',getGrupos);
routerGruposPublicos.get('/getGroup/:id',getDataGroups);
routerGruposPublicos.post('/createGroup',createGroup);