const express = require('express');
const router = express.Router();

//envio de email
require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.LOGIN,
        pass: process.env.SENHA
    },
    // tls:{
    //     rejectUnauthorized: false
    // }
});

router.post('/email', (req, res) => { 
    
    const { email, nome, assunto, mensagem } = req.body;
    
    const options = {
        from: email, 
        to: 'petweb2002@gmail.com', 
        subject: assunto,
        text: 'Usuário: ' + nome + 'Enviou: ' + mensagem
    };

    transporter.sendMail(options, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            alert('E-mail enviado: ' + info.response);
        }
    });
});

//

router.get('/', (req, res) => {
  res.render('home');
});

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/contact', (req, res) => {
  res.render('contact');
});

router.get('/tec', (req, res) => {
  res.render('tec');
});



module.exports = router;
