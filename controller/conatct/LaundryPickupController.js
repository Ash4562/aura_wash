

const LaundryPickup = require("../../models/contact/LaundryPickup");
const { sendEmail } = require("../../utils/email");


exports.Pickup = async (req, res) => {
    try {
        const { name,  contact,address, service,PickupDateTime, SpecialInstructions} = req.body;

        if (!name || !contact || !address ||!service|| !PickupDateTime||!SpecialInstructions) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Save to DB
        const newContact = new LaundryPickup
            ({name,  contact,address, service,PickupDateTime, SpecialInstructions});
        await newContact.save();

        // Send email to admin
        const emailContent = `
        <h3>New Contact Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Phone Number:</strong> ${contact}</p>
        <p><strong>Address:</strong> ${address}</p>
        <p><strong>Service Type:</strong> ${service}</p>
        <p><strong>Pickup Date & Time:</strong> ${PickupDateTime}</p>
        <p><strong>Special Instructions:</strong> ${SpecialInstructions}</p>
      `;

        await sendEmail({
            to: process.env.ADMIN_EMAIL, // put your admin email in env
            
            subject: 'New Contact Received',
            message: emailContent,
        });
        console.log("Sending to:", process.env.ADMIN_EMAIL);

        res.status(201).json({ message: 'Contact submitted and email sent successfully!' });
    } catch (error) {
        console.error('Error submitting Contact:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
};
