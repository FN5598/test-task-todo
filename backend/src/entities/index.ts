import { AuthSession } from "./auth-session.js";
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

User.hasMany(AuthSession, {
  foreignKey: "userId",
  as: "authSessions",
  onDelete: "CASCADE",
});

AuthSession.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export { AuthSession, Task, User };
export { TaskStatus } from "./task.js";
