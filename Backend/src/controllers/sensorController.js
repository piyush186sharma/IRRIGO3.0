import transporter from "../config/mailer.js";
import {User} from "../models/student.js";

export const checkSensorAndNotify = async (req, res) => {
    console.log("Mail API hit");
  try {
    console.log(req.body);
    const { userId, zone, moisture, warningThreshold } = req.body;

    // Check if moisture is below warning level
    if (moisture < warningThreshold) {

        
      const user = await User.findById(userId);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "⚠️ Irrigation Warning",
        text: `Warning! Soil moisture in Zone ${zone} dropped to ${moisture}. Please check irrigation system.`
      };

      await transporter.sendMail(mailOptions);
      console.log("sent")
    }

    res.status(200).json({ message: "Sensor checked" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};