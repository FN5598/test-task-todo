import { app } from "./app.js";
import { getAuthConfig } from "@config/auth-config.js";
import { sequelize } from "@config/database.js";
import "@shared/entities/register-models.js";
import { logger } from "@shared/logger.js";

const port = Number(process.env.PORT ?? 4000);

async function startServer() {
  getAuthConfig();
  await sequelize.authenticate();
  logger.info("PostgreSQL connection established");
  await sequelize.sync();
  logger.info("Database schema is ready");

  app.listen(port, () => {
    logger.info({ port }, "API listening");
  });
}

startServer().catch((error: unknown) => {
  logger.fatal({ err: error }, "Unable to start API");
  process.exitCode = 1;
});
