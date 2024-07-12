import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import nodemailer from "nodemailer";
import { ClientError } from "../errors/client-error";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/invites",
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid(),
        }),
        body: z.object({
          email: z.string().email(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const { email } = request.body;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
      });

      if (!trip) {
        throw new ClientError("Trip not found");
      }

      const participant = await prisma.participant.create({
        data: {
          email,
          trip_id: tripId,
        },
      });

      const formattedStartDate = dayjs(trip.starts_at).format("LL");
      const formattedEndDate = dayjs(trip.starts_at).format("LL");

      const confirmationLink = `http://localhost:3333/participants/${participant.id}/confirm`;

      const mail = await getMailClient();
      const message = await mail.sendMail({
        from: {
          name: "Equipe Plann.er",
          address: "test@plann.er",
        },
        to: participant.email,
        subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedStartDate}`,
        html: `<div style="font-family: sans-serif; font-size: 16px; line-height: 1.6">
                    <p>
                      Você para participar de uma viagem para <strong>${trip.destination}</strong>,
                      Brasil nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}.
                    </p>
                    <p></p>
                    <p>para confirmar sua presença na viagem, clique no link abaixo</p>
                    <p></p>
                    <p>
                      <a href=${confirmationLink}>Confirmar Viagem</a>
                    </p>
    
                    <p></p>
                    <p>Caso você não saiba do que se trata esse e-mail, apenas ignore essa</p>
                  </div>`.trim(),
      });

      console.log(nodemailer.getTestMessageUrl(message));

      return { participantId: participant.id };
    }
  );
}
