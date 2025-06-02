import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import { defineSecret } from "firebase-functions/params";

admin.initializeApp();
const db = admin.firestore();

const gmailUser = defineSecret("GMAIL_USER");
const gmailPass = defineSecret("GMAIL_PASS");

const formatTime = (time: string = "") => {
  const [h, m] = time.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return "Hora desconocida";
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${suffix}`;
};

export const dailyReminderEmail = functions
  .region("europe-west1")
  .runWith({
    secrets: ["GMAIL_USER", "GMAIL_PASS"],
  })
  .pubsub.schedule("0 7 * * *")
  .timeZone("Europe/Madrid")
  .onRun(async () => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser.value(),
        pass: gmailPass.value(),
      },
    });

    const today = new Date().toDateString();
    const usersSnapshot = await db.collection("hcc_ai_users").get();

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();
      const email = userData?.email;
      const name = userData?.userName || "";

      if (!email) {
        console.log(`Usuario ${userId} no tiene correo electrónico.`);
        continue;
      }

      const remindersSnapshot = await db
        .collection("hcc_ai_users")
        .doc(userId)
        .collection("reminders")
        .where("date", "==", today)
        .get();

      const sortedReminders = remindersSnapshot.docs
        .map(doc => doc.data())
        .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

      const reminderLines = sortedReminders.map(reminder => {
        const time = reminder.time ? formatTime(reminder.time) : "Sin hora";
        return `• ${reminder.text} (${time})`;
      });

      const calendarLink = "https://hcc-ai.vercel.app/calendar";

      const text = reminderLines.length > 0
        ? `¡Buenos días, ${name}!\n\nAquí tienes tus recordatorios para hoy ${today}:\n\n${reminderLines.join("\n")}\n\nPuedes consultarlos y gestionarlos también en tu calendario:\n${calendarLink}\n\n¡Disfruta del día!\nEquipo HCC-AI.`
        : `¡Buenos días, ${name}!\n\nHoy ${today} no tienes ningún recordatorio ni evento pendiente.\n\nPuedes revisar tu calendario aquí:\n${calendarLink}\n\n¡Disfruta del día!\nEquipo HCC-AI.`;

      const mailOptions = {
        from: gmailUser.value(),
        to: email,
        subject: "📅 Tus recordatorios de hoy en HCC-AI",
        text,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (error) {
        console.error(`Error al enviar correo a ${email}:`, error);
      }
    }

    return null;
  });
