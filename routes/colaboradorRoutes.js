const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const ColaboradorController = require('../controllers/colaboradorController');
const colaboradorController = new ColaboradorController();
const AgendamentoController = require('../controllers/agendamentoController');
const agendamentoController = new AgendamentoController();

const auth = require('../middleware/auth')

router.get('/criarConta', async (req, res) => {
  res.render('criarConta')
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
      res.redirect('/');
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao cadastrar o colaborador.' });
    });
});

router.get('/telaEditar', auth, async(req, res) => {
  const colaboradorId = req.user.colaboradorId;
  const ObjIdColab = new ObjectId(colaboradorId);
  colaboradorController.findOne(ObjIdColab)
    .then((colaborador) => {
      res.render('editarConta', { colaborador: colaborador });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao buscar colaborador.' });
    });
});

router.post('/editarConta',auth, async(req, res) => {
  const colaboradorId = req.user.colaboradorId;
  const nomeColab = req.user.nome;
  console.log("Nome q sera utilizzado na edicao dos agendamentos" +req.user.nome);
  const {  nome, email, senha } = req.body;
  const colabAtualizado = {
    nome,
    email,
    senha,
    timestamp: new Date().getTime(), 
  };

  colaboradorController.updateColaborador(colaboradorId, colabAtualizado)
    .then(() => {
      agendamentoController.updateAgendamentoColaborador(nomeColab, nome)
        .then(() => {
          res.redirect('/agendamentos/agendamentos');
        }).catch((error) => {
          res.status(500).json({ error: 'Ocorreu um erro ao redirecionar.' });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao atualizar o agendamento.' });
    });
});

router.delete('/', auth, async (req, res) => {
  const colaboradorId = req.user.colaboradorId;
  const ObjIdColab = new ObjectId(colaboradorId);
  colaboradorController.deleteColaborador(ObjIdColab)
    .then((result) => {
        res.status(200).json({ result: result + "Conta deletada." });
    })
    .catch((error) => {
      res.status(500).json({ error: error + 'Ocorreu um erro ao remvoer o agendamento com o pet parametrizado.' });
    });
});

router.post('/loginColaborador', (req, res) => {
  const email = req.body.email;
  const senha = req.body.senha;
  
  colaboradorController.findOne({ email, senha })
  .then(user => {
    if (user) {
      const token = jwt.sign({ colaboradorId: user._id, nome: user.nome }, process.env.JWT_PASSWORD, { expiresIn: '30min' });
      res.cookie('token', token, { httpOnly: true });
      res.redirect('/agendamentos/agendamentos');
    } else {
      res.status(400).json({ error: 'Email ou senha inválidos' });
    }
 
})
.catch(error => {
  console.error(error);
  res.status(500).send('Erro interno do servidor');
});
});

module.exports = router;
