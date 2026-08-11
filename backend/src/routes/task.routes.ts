import { Router } from "express";
import { TaskController } from "@tasks/controllers/task-controller.js";
import { requireAccessToken } from "@middlewares/auth-middleware.js";

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
