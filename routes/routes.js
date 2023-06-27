const express = require('express');
const router = express.Router();
require('dotenv').config();
const auth = require('../middleware/auth');

// const AgendamentoController = require('../controllers/agendamentoController');
// const agendamento = new AgendamentoController();

// const PetController = require('../controllers/petController');
// const pet = new PetController();

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  },
  tls:{
    rejectUnauthorized: false
  }
});

// Rota envio de email - Contato

router.post('/email', auth, async(req, res) => {   
    
    const { email, nome, assunto, mensagem } = req.body;
    
    const options = {
        from: email, 
        to: process.env.EMAIL, 
        subject: assunto,
        text: `Nome: ${nome}\nEmail: ${email}\n\n${mensagem}`,
    };

    transporter.sendMail(options, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send('Erro ao enviar o e-mail.');
      } else {
        console.log('E-mail enviado: ' + info.response);
        res.send('E-mail enviado com sucesso!');
        res.render('contato')
      }
    });
});

//

// Rotas padroes

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/sobre', auth, async(req, res) => {
  res.render('sobre');
});

router.get('/contato', auth, async (req, res) => {
  res.render('contato');
});

router.get('/tecnologias', auth, async (req, res) => {
  res.render('tecnologias');
});

router.get('/logout', auth, async(req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});



module.exports = router;
