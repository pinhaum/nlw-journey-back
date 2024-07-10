import fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { createTrip } from "./routes/create-trip";

const app = fastify();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip);

app
  .listen({ port: 3333 })
  .then(() => {
    console.log(`Server listening on port 3333`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
