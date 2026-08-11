import { app } from "./app.js";
import { sequelize } from "./database.js";
import "./entities/index.js";
import { logger } from "./logger.js";

const port = Number(process.env.PORT ?? 4000);

async function startServer() {
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
