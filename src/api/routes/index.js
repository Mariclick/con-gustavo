import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";
import swaggerSpecification from "../../config/swagger.js";

import { validateCreation, validatePatch } from "./validation/post.js";

import { getByName } from "./controllers/get.js";

import { createUser } from "./controllers/post.js";
import  editUser  from "./controllers/patch.js";
import deleteOne from "./controllers/delete.js";

const router = Router();

router
  .post("/storytelling", validateCreation, createUser)
  .get("/storytelling", getByName)
  .patch("/storytelling/:id", validatePatch, editUser)
  .delete("/storytelling/:id", validateCreation, deleteOne);

router.use("/docs", serve);
router.get("/docs", setup(swaggerJsdoc(swaggerSpecification)));

export default router;
