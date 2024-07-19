const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/verify-captcha', async (req, res) => {
    const recaptchaResponse = req.body['g-recaptcha-response'];
    const secretKey = '6LfAwhMqAAAAANUjOfK3KPsRU-slqPbIDckWJjru';
    const verifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;

    const response = await fetch(verifyURL, {
        method: 'POST'
    });
    const data = await response.json();

    if (data.success) {
        res.send('reCAPTCHA verificado com sucesso.');
    } else {
        res.send('Falha na verificação do reCAPTCHA.');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
