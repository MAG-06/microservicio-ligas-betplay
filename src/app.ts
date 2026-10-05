import Fastify from "fastify";
import { config } from "./config/env";
import { sincronizarLigas } from "./services/sync.service";

const app = Fastify({ logger: true });

app.post("/api/sync", async (req, reply) => {
  const token = req.headers.authorization;
  if (token !== `Bearer ${config.syncToken}`) {
    return reply.status(401).send({ detail: "No autorizado" });
  }
  return sincronizarLigas();
});

app.listen({ port: config.port, host: config.host }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
