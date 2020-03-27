const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = async (email, name) => {
        await sgMail.send({
        to: email,
        from: 'aerdnach@mail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })

    console.log('Email sent to ' + email)

}

const sendCancelationEmail = async (email, name) => {
    await sgMail.send({
        to: email,
        from: 'aerdnach@mail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see you back sometime soon.`
    })

    console.log('Email sent to ' + email)
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}