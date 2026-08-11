import { AuthSession } from "@users/entities/auth-session.js";
import { User } from "@users/entities/user.js";
import { Task } from "@tasks/entities/task.js";

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
