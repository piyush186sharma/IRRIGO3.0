import db from "../config/firebaseAdmin.js";   // ✅ your firebase config
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const checkSensorAndNotify = async (req, res) => {
  try {
    // 🔹 Fetch data from Firebase
    const snapshot = await db.ref("/").once("value");
    const firebaseData = snapshot.val();

    if (!firebaseData) {
      return res.status(404).json({ message: "No data found in Firebase" });
    }

    const zonecnt = firebaseData.zonecnt || 0;
    const zones = firebaseData.zones || {};

    // 🔹 Start building email
    let emailHTML = `
      <h2>⚠️ IRRIGO Live Sensor Report</h2>
      <p><b>Total Zones:</b> 2</p>
    `;

    let alertTriggered = false;

    // 🔹 Loop through zones dynamically
    for (let i = 1; i <= zonecnt; i++) {
      const zoneKey = `zone${i}`;
      const zone = zones[zoneKey];

      if (!zone) continue;

      emailHTML += `
        <hr/>
        <h3>Zone ${i}</h3>
        <ul>
          <li><b>Moisture:</b> ${zone.Moisture ?? "N/A"}</li>
          <li><b>Humidity:</b> ${zone.Humidity ?? "N/A"}</li>
          <li><b>EC:</b> ${zone.EC ?? "N/A"}</li>
          <li><b>Nitrogen:</b> ${zone.Nitrogen ?? "N/A"}</li>
          <li><b>Phosphorus:</b> ${zone.Phosphorus ?? "N/A"}</li>
          <li><b>Potassium:</b> ${zone.Potassium ?? "N/A"}</li>
          <li><b>Rainfall:</b> ${zone.Rainfall ?? "N/A"}</li>
          <li><b>Sprinkler:</b> ${zone.Sprinkler ?? "N/A"}</li>
        </ul>
      `;

      // 🔥 Alert condition
      if (zone.Moisture !== undefined && zone.Moisture < 0.3) {
        alertTriggered = true;

        emailHTML += `
          <p style="color:red;">
            ⚠️ <b>Low Moisture Detected → Irrigation Started</b>
          </p>
        `;
      }
    }

    // 🔹 Add timestamp
    emailHTML += `
      <hr/>
      <p><i>Generated at: ${new Date().toLocaleString()}</i></p>
    `;

    // 🔹 Optional: Only send if alert triggered
    if (!alertTriggered) {
      return res.status(200).json({
        success: true,
        message: "No alert triggered. Email not sent."
      });
    }

    // 🔹 Send Email
    const { data, error } = await resend.emails.send({
      from: "IRRIGO <onboarding@resend.dev>",
      to: "piyushsharmaspsghy@gmail.com",
      subject: `🚨 IRRIGO Alert - ${zonecnt} Zones`,
      html: emailHTML
    });

    if (error) {
      return res.status(400).json({ error });
    }

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      data
    });

  } catch (err) {
    console.error("Error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch data or send email"
    });
  }
};