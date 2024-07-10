import fastify from "fastify";

const app = fastify();

app.get("/", async (req, res) => {
  return "hello";
});

app
  .listen({ port: 3333 })
  .then(() => {
    console.log(`Server listening on port 3333`);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
