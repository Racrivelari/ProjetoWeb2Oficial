const express = require('express');
const router = express.Router();

const { ObjectId } = require('mongodb');

const AgendamentoController = require('../controllers/agendamentoController');
const agendamentoController = new AgendamentoController();

const PetController = require('../controllers/petController')
const petController = new PetController();

const auth = require('../middleware/auth')
router.use(auth);

router.get('/criarAgendamento', (req, res) => {
  petController.readPets()
    .then((pets) => {
      res.render('criarAgendamento', { pets });
    }).catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao buscar agendamento.' });
    });

});

router.get('/agendamentos', auth, async(req, res) => {
  agendamentoController.readAgendamentos()
    .then((agendamentos) => {
      res.render('agendamentos', { agendamentos });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao obter os agendamentos.' });
    });
});

router.get('/editarAgendamento/:id', async (req, res) => {
  try {
    const agendamentoId = req.params.id;
    const teste = new ObjectId(agendamentoId);
    
    const agendamentos = await agendamentoController.findOne(teste);
    const pet = await petController.findOneByNome(agendamentos.pet);
    let pets = await petController.readPets();
    
    pets = pets.filter((pet) => pet.nome !== pet.nome);
    
    res.render('editarAgendamento', { agendamentos, pet, pets });
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro ao buscar o agendamento.' });
  }
});


router.post('/editarAgendamento', (req, res) => {
  const colaboradorId = req.user.colaboradorId;
  const nomeColaborador = req.user.nome;

  const { id, pet, tipoAgendamento, data } = req.body;
  const novoAgendamento = {
    pet,
    tipoAgendamento,
    data,
    nomeColaborador,
    colaboradorId,
    timestamp: new Date().getTime(), 
  };

  agendamentoController.updateAgendamento(id, novoAgendamento)
    .then(() => {
      res.redirect('/agendamentos/agendamentos');
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao atualizar o agendamento.' });
    });
});

router.delete('/:id', (req, res) => {
  const agendamentoId = req.params.id;
  const teste = new ObjectId(agendamentoId);

  agendamentoController.deleteAgendamento(teste)
    .then((result) => {
      res.status(200).json({ result: result + "Agendamento deletado." });
    })
    .catch((error) => {
      res.status(500).json({ error: error + 'Ocorreu um erro ao excluir o agendamento.' });
    });
});

router.post('/', (req, res) => {
  const colaboradorId = req.user.colaboradorId;
  const nomeColaborador = req.user.nome;
  const { pet, tipoAgendamento, data } = req.body;
  const novoAgendamento = {
    pet,
    tipoAgendamento,
    data,
    nomeColaborador,
    colaboradorId,
    timestamp: new Date().getTime(), 
  };

  agendamentoController.createAgendamento(novoAgendamento)
    .then(() => {
      res.redirect('/agendamentos/agendamentos');
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao cadastrar o agendamento.' });
    });
});

module.exports = router;
