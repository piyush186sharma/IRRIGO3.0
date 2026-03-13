
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const checkSensorAndNotify = async (req, res) => {
  try {

    

    const { data, error } = await resend.emails.send({
      from: "IRRIGO <onboarding@resend.dev>",
      to: "piyushsharmaspsghy@gmail.com",
      subject: "IRRIGO Alert",
      html: `
        <h2>⚠️ IRRIGO Alert</h2>
        <p>Soil moisture for <b>Zone 1</b> is below threshold.</p>
        <p>The irrigation is being started.</p>
      `
    });

    if (error) return res.status(400).json({ error });

    res.status(200).json({
      success: true,
      message: "Email sent successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send email" });
  }
};