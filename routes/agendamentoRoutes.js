const express = require('express');
const router = express.Router();

const { ObjectId } = require('mongodb');

const AgendamentoController = require('../controllers/agendamentoController');
const agendamentoController = new AgendamentoController();

const PetController = require('../controllers/petController')
const petController = new PetController();

const auth = require('../middleware/auth')
router.use(auth);
router.get('/', (req, res) => {

});

router.get('/criarAgendamento', (req, res) => {
  petController.readPets()
    .then((pets) => {
      res.render('criarAgendamento', { pets });
    }).catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao buscar agendamento.' });
    });

});

router.get('/editarAgendamento/:id', (req, res) => {
  const agendamentoId = req.params.id;
  const teste = new ObjectId(agendamentoId);
  agendamentoController.findOne(teste)
    .then((agendamentos) => {
      petController.findOneByNome(agendamentos.pet)
        .then((pet) => {
          petController.readPets()
            .then((pets) => {
              console.log(agendamentos.pet)
              pets = pets.filter((pets) => pets.nome !== pet.nome);
              res.render('editarAgendamento', { agendamentos: agendamentos, pet: pet, pets: pets });
            })
            .catch((error) => {
              res.status(500).json({ error: error + 'Ocorreu um erro ao buscar o pet.asd' });
            });
        })
        .catch((error) => {
          res.status(500).json({ error: 'Ocorreu um erro ao buscar o pet123.' });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao buscar o agendamento.' });
    });
});

router.post('/editarAgendamento', (req, res) => {
  const colaboradorId = req.user.colaboradorId;

  const { id, pet, tipoAgendamento, data, nomeColaborador } = req.body;
  const novoAgendamento = {
    pet,
    tipoAgendamento,
    data,
    // nomeColaborador,
    colaboradorId,
    timestamp: new Date().getTime(), 
  };

  agendamentoController.updateAgendamento(id, novoAgendamento)
    .then(() => {
      res.redirect('/agendamentos');
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
  console.log(req.user);
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
      res.redirect('/agendamentos');
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao cadastrar o agendamento.' });
    });
});

module.exports = router;
