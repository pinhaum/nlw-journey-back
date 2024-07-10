import fastify from "fastify";
import cors from "@fastify/cors";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createTrip } from "./routes/create-trip";
import { confirmTrip } from "./routes/confirm-trip";

const app = fastify();

app.register(cors, {
  // TODO: set origin to frontend address
  origin: "*",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);
app.register(confirmTrip);

app
  .listen({ port: 3333 })
  .then(() => {
    console.log(`Server listening on port 3333`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
