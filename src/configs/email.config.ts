export default () => ({
	email: {
		host: process.env.EMAIL_HOST || "smtp.gmail.com",
		port: parseInt(process.env.EMAIL_PORT, 10) || 587,
		user: process.env.MY_EMAIL,
		pass: process.env.MY_EMAIL_PASS,
		from: process.env.EMAIL_FROM
	}
})