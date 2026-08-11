import { Router } from "express";
import { TaskController } from "../controllers/index.js";
import { requireAccessToken } from "../middlewares/index.js";

const taskController = new TaskController();

export const taskRouter = Router();

taskRouter.use(requireAccessToken);
taskRouter.route("/").get(taskController.list).post(taskController.create);
taskRouter.get("/counts", taskController.counts);
taskRouter.get("/slug/:slug", taskController.getBySlug);
taskRouter
  .route("/:taskId")
  .get(taskController.get)
  .patch(taskController.update)
  .delete(taskController.delete);
