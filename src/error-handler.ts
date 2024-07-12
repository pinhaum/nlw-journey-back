import { FastifyInstance } from "fastify";
import { ClientError } from "./errors/client-error";
import { ZodError } from "zod";

type FatifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FatifyErrorHandler = (error, request, reply) => {
  console.log(error);

  if (error instanceof ZodError) {
    reply
      .status(400)
      .send({ message: "invalid input", errors: error.flatten().fieldErrors });
  }

  if (error instanceof ClientError) {
    reply.status(400).send({ message: error.message });
  }

  return reply.status(500).send({ message: "Internal server error" });
};
