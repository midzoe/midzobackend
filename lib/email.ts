import nodemailer from 'nodemailer';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

export async function sendVerificationEmail(email: string, code: string): Promise<void> {
  // In development without email config, log to console instead
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV] Verification code for ${email}: ${code}`);
    return;
  }

  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  await transporter.sendMail({
    from,
    to: email,
    subject: `Your Midzoe verification code: ${code}`,
    text: `Your verification code is: ${code}\n\nThis code expires in 15 minutes.\n\nIf you did not create a Midzoe account, you can safely ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a2e;">Verify your Midzoe account</h2>
        <p style="color: #555;">Enter the code below to complete your registration:</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; padding: 24px; background: #f5f5f5; text-align: center; border-radius: 8px; color: #1a1a2e; margin: 24px 0;">
          ${code}
        </div>
        <p style="color: #555;">This code expires in <strong>15 minutes</strong>.</p>
        <p style="color: #999; font-size: 13px;">If you did not create a Midzoe account, you can safely ignore this email.</p>
      </div>
    `,
  });
}

/** Montant en centimes → chaîne lisible dans la devise (ex. 4900 EUR → "49,00 €"). */
function formatAmount(cents: number, currency: string): string {
  const amount = cents / 100;
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency }).format(amount);
  } catch {
    // Devise inconnue d'Intl : repli neutre, jamais de throw dans un email best-effort.
    return `${amount.toFixed(2)} ${currency}`;
  }
}

/**
 * Email d'accompagnement envoyé au passage premium (story 3.5, FR8b).
 *
 * Best-effort : appelé APRÈS le commit de la transaction premium du webhook, dans un
 * try/catch qui ne fait jamais échouer le webhook. Comme sendVerificationEmail, se réduit
 * à un log si le SMTP n'est pas configuré (jamais de throw en dev).
 */
export async function sendPremiumWelcomeEmail(
  email: string,
  firstName: string | null,
  details: { packageName: string | null; amountCents: number; currency: string }
): Promise<void> {
  const packageLabel = details.packageName ?? "votre package personnalisé";
  const amount = formatAmount(details.amountCents, details.currency);
  const greeting = firstName ? `Bonjour ${firstName},` : "Bonjour,";

  // Sans config SMTP, on logge au lieu d'envoyer (cohérent avec sendVerificationEmail).
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV] Premium welcome email for ${email}: ${packageLabel} (${amount})`);
    return;
  }

  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  await transporter.sendMail({
    from,
    to: email,
    subject: "Bienvenue chez Midzo Premium — nous suivons votre dossier",
    text:
      `${greeting}\n\n` +
      `Votre paiement est confirmé : votre compte est désormais premium (${packageLabel}, ${amount}).\n\n` +
      `À partir de maintenant, l'équipe Midzo vous accompagne et suit votre dossier à chaque étape. ` +
      `Nous reviendrons vers vous par email pour la suite de votre parcours.\n\n` +
      `Merci de votre confiance,\nL'équipe Midzo`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a2e;">Bienvenue chez Midzo Premium</h2>
        <p style="color: #555;">${greeting}</p>
        <p style="color: #555;">
          Votre paiement est confirmé : votre compte est désormais <strong>premium</strong>
          (${packageLabel} — <strong>${amount}</strong>).
        </p>
        <p style="color: #555;">
          À partir de maintenant, l'équipe Midzo vous <strong>accompagne et suit votre dossier</strong>
          à chaque étape. Nous reviendrons vers vous par email pour la suite de votre parcours.
        </p>
        <p style="color: #999; font-size: 13px;">Merci de votre confiance,<br/>L'équipe Midzo</p>
      </div>
    `,
  });
}

/**
 * Envoi d'une campagne newsletter (story 8.5, FR33) à une liste de destinataires.
 * Best-effort : sans SMTP, logge un résumé et renvoie le compte « envoyé » simulé.
 * Retourne { sent, failed } pour la journalisation admin.
 */
export async function sendNewsletterCampaign(
  recipients: string[],
  subject: string,
  htmlBody: string,
  textBody: string
): Promise<{ sent: number; failed: number }> {
  if (recipients.length === 0) return { sent: 0, failed: 0 };

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV] Newsletter campaign "${subject}" → ${recipients.length} destinataire(s): ${recipients.join(", ")}`);
    return { sent: recipients.length, failed: 0 };
  }

  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  let sent = 0;
  let failed = 0;

  for (const to of recipients) {
    try {
      await transporter.sendMail({ from, to, subject, text: textBody, html: htmlBody });
      sent++;
    } catch (e) {
      console.error(`Newsletter send failed for ${to}:`, e);
      failed++;
    }
  }
  return { sent, failed };
}

/**
 * Notification interne à l'équipe quand un message de contact arrive (story 8.1, FR28).
 * Best-effort : se réduit à un log si le SMTP n'est pas configuré.
 * Destinataire = CONTACT_INBOX ou EMAIL_FROM/EMAIL_USER par défaut.
 */
export async function sendContactNotificationEmail(details: {
  name: string;
  email: string;
  subject: string | null;
  category: string | null;
  subcategory: string | null;
  message: string;
  isPremium: boolean;
}): Promise<void> {
  const inbox = process.env.CONTACT_INBOX || process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const tag = details.isPremium ? "[PREMIUM] " : "";
  const cat = [details.category, details.subcategory].filter(Boolean).join(" / ") || "—";

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !inbox) {
    console.log(
      `[DEV] Contact message from ${details.name} <${details.email}> ${tag}(${cat}): ${details.subject ?? "(sans sujet)"}`
    );
    return;
  }

  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  await transporter.sendMail({
    from,
    to: inbox,
    replyTo: details.email,
    subject: `${tag}Nouveau message de contact — ${details.subject ?? cat}`,
    text:
      `De : ${details.name} <${details.email}>\n` +
      `Catégorie : ${cat}\n` +
      `Premium : ${details.isPremium ? "oui" : "non"}\n\n` +
      `${details.message}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a2e;">Nouveau message de contact</h2>
        <p style="color: #555;"><strong>De :</strong> ${details.name} &lt;${details.email}&gt;</p>
        <p style="color: #555;"><strong>Catégorie :</strong> ${cat}</p>
        <p style="color: #555;"><strong>Premium :</strong> ${details.isPremium ? "oui" : "non"}</p>
        <hr/>
        <p style="color: #333; white-space: pre-wrap;">${details.message}</p>
      </div>
    `,
  });
}

/**
 * Email de rappel de départ (story 7.5, FR50). Envoyé par le job planifié quand le départ
 * approche : rappelle les éléments manquants ou confirme que tout est prêt.
 * Best-effort : se réduit à un log si le SMTP n'est pas configuré.
 */
export async function sendTripReminderEmail(
  email: string,
  firstName: string | null,
  details: { tripTitle: string; startDate: Date | null; ready: boolean; missing: string[] }
): Promise<void> {
  const greeting = firstName ? `Bonjour ${firstName},` : "Bonjour,";
  const when = details.startDate ? new Date(details.startDate).toLocaleDateString("fr-FR") : "prochainement";
  const statusLine = details.ready
    ? `Bonne nouvelle : tout est prêt pour votre voyage « ${details.tripTitle} ».`
    : `Il reste des éléments à préparer pour « ${details.tripTitle} » : ${details.missing.join(", ")}.`;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log(`[DEV] Trip reminder for ${email}: ${details.tripTitle} (départ ${when}) — ${details.ready ? "prêt" : "manque: " + details.missing.join(", ")}`);
    return;
  }

  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;

  await transporter.sendMail({
    from,
    to: email,
    subject: `Votre départ approche — ${details.tripTitle}`,
    text: `${greeting}\n\nVotre départ (${when}) approche.\n${statusLine}\n\nL'équipe Midzo`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1a1a2e;">Votre départ approche</h2>
        <p style="color: #555;">${greeting}</p>
        <p style="color: #555;">Votre départ (<strong>${when}</strong>) approche.</p>
        <p style="color: #555;">${statusLine}</p>
        <p style="color: #999; font-size: 13px;">L'équipe Midzo</p>
      </div>
    `,
  });
}
