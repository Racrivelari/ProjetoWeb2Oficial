const express = require('express');
const router = express.Router();
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

module.exports = router;
