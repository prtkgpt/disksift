import "server-only";

import { Resend } from "resend";

type TransactionalEmail = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  idempotencyKey?: string;
};

function getEmailConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    throw new Error("Resend is not configured. Set RESEND_API_KEY and RESEND_FROM_EMAIL.");
  }

  return {
    client: new Resend(apiKey),
    from,
    replyTo: process.env.SUPPORT_EMAIL,
  };
}

export async function sendTransactionalEmail(email: TransactionalEmail) {
  const { client, from, replyTo } = getEmailConfig();
  const options = email.idempotencyKey
    ? { idempotencyKey: email.idempotencyKey }
    : undefined;

  const { data, error } = await client.emails.send(
    {
      from,
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      replyTo,
    },
    options,
  );

  if (error) {
    throw new Error(`Resend failed: ${error.message}`);
  }

  return data;
}

