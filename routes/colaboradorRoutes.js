const express = require('express');
const Validation = require('../middleware/validation');

const validation = new Validation();

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

  const { error } = validation.validateColaborador(novoColaborador);
  if (error) {
    return res.render('criarConta', { error: error.details[0].message });
  }

  colaboradorController.createColaborador(novoColaborador)
    .then(() => {
      res.redirect('/');
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao cadastrar o colaborador.' + error });
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

router.post('/editarConta', auth, async (req, res) => {
  const colaboradorId = req.user.colaboradorId;
  const nomeColab = req.user.nome;
  const { nome, email, senha } = req.body;
  const colabAtualizado = {
    nome,
    email,
    senha,
    timestamp: new Date().getTime(),
  };

  const { error } = validation.validateColaborador(colabAtualizado);

  if (error) {
    return colaboradorController.findOne(new ObjectId(colaboradorId))
      .then((colaborador) => {
        res.render('editarConta', { colaborador, error: error.details[0].message });
      })
      .catch(() => {
        res.status(500).json({ error: 'Ocorreu um erro ao buscar colaborador.' });
      });
  }

  try {
    await colaboradorController.updateColaborador(colaboradorId, colabAtualizado);
    await agendamentoController.updateAgendamentoColaborador(nomeColab, nome);
    res.redirect('/agendamentos/agendamentos');
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar o colab.' });
  }
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
