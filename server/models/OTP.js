const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")
const emailTemplate = require("../mail/templates/emailVerificationTemplate")

const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // Auto delete after 5 minutes
	},
})

// Function to send verification email
async function sendVerificationEmail(email, otp) {
	try {
		const mailResponse = await mailSender(
			email,
			"Verification Email",
			emailTemplate(otp)
		)

		console.log("Email sent successfully: ", mailResponse.response)
	} catch (error) {
		console.log("Error occurred while sending email: ", error)
		throw error
	}
}

// Pre-save hook (same business logic retained)
// Email will be sent before saving OTP in database
OTPSchema.pre("save", async function () {
	console.log("New document saved to database")

	// Only send email when a new OTP document is created
	if (this.isNew) {
		await sendVerificationEmail(this.email, this.otp)
	}
})

const OTP = mongoose.model("OTP", OTPSchema)

module.exports = OTP