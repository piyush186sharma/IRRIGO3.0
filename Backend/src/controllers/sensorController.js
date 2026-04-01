// utils/sendAlertEmail.js

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendAlertEmail = async (zoneName, firebaseZone, threshold) => {

  const emailHTML = `
    <h2>⚠️ IRRIGO Alert</h2>
    <h3>${zoneName.toUpperCase()}</h3>

    <ul>
      <li><b>Humidity:</b> ${firebaseZone.Humidity}</li>
      <li><b>Moisture:</b> ${firebaseZone.Moisture}</li>
      <li><b>EC:</b> ${firebaseZone.EC}</li>
      <li><b>Nitrogen:</b> ${firebaseZone.Nitrogen}</li>
      <li><b>Phosphorus:</b> ${firebaseZone.Phosphorus}</li>
      <li><b>Potassium:</b> ${firebaseZone.Potassium}</li>
      <li><b>Rainfall:</b> ${firebaseZone.Rainfall}</li>
    </ul>

    <p style="color:red;">
      ⚠️ Humidity (${firebaseZone.Humidity}) is below threshold (${threshold})
    </p>

    <p><i>${new Date().toLocaleString()}</i></p>
  `;

  await resend.emails.send({
    from: "IRRIGO <onboarding@resend.dev>",
    to: "piyushsharmaspsghy@gmail.com",
    subject: `🚨 Alert - ${zoneName}`,
    html: emailHTML
  });
};