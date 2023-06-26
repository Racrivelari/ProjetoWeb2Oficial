const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const ColaboradorController = require('../controllers/colaboradorController');
const colaboradorController = new ColaboradorController();


router.get('/novoColaborador', (req, res) => {
  res.render('novoColaborador');
});

router.post('/novoColaborador', (req, res) => {
  const { nome, email, senha } = req.body;

  const novoColaborador = {
    nome,
    email,
    senha,
    timestamp: new Date().getTime(),
  };
  colaboradorController.createColaborador(novoColaborador)
    .then(() => {
      res.render('login');
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao cadastrar o colaborador.' });
    });
});

router.post('/loginColaborador', async (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;

  try {
    const user = await colaboradorController.findOne({ email, senha });

    if (user) {
      const token = jwt.sign({ colaboradorId: user._id }, process.env.JWT_PASSWORD, { expiresIn: '10m' });
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/home');
    } else {
      res.status(400).json({ error: 'Email ou senha inválidos' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor');
  }
});

module.exports = router;
