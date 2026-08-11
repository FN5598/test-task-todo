import { Task } from "./task.js";
import { User } from "./user.js";

User.hasMany(Task, {
  foreignKey: "userId",
  as: "tasks",
  onDelete: "CASCADE",
});

Task.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export { Task, User };
export { type TaskStatus } from "./task.js";
