const express = require('express');

const Validation = require('../middleware/validation');

const validation = new Validation();

const router = express.Router();

const { ObjectId } = require('mongodb');

const PetController = require('../controllers/petController');
const petController = new PetController();

const AgendamentoController = require('../controllers/agendamentoController');
const agendamentoController = new AgendamentoController();

const auth = require('../middleware/auth')
router.use(auth);

router.get('/criarPet', async (req, res) => {
  res.render('criarPet');
});

router.get('/pets', async (req, res) => {
  petController.readPets()
    .then((pets) => {
      res.render('pets', { pets });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao buscar pets.' });
    });
});

router.get('/editarPet/:id', async (req, res) => {
  const petId = req.params.id;

  const ObjIdPet = new ObjectId(petId);
  petController.findOne(ObjIdPet)
    .then((pet) => {
      res.render('editarPet', { pet: pet });
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao buscar pet.' + error });
    });
});

router.post('/editarPet', async (req, res) => {
  const { id, nome, idade, porte, tipo, peso, nomeCliente, nomeAntigo } = req.body;
  const petAtualizado = {
    nome,
    idade,
    porte,
    tipo,
    peso,
    nomeCliente,
    timestamp: new Date().getTime(),
  };

  const { error } = validation.validatePet(petAtualizado);

  if (error) {
    return petController.findOne(new ObjectId(id))
      .then((pet) => {
        res.render('editarPet', { pet, error: error.details[0].message });
      })
      .catch(() => {
        res.status(500).json({ error: 'Ocorreu um erro ao buscar pet.' });
      });
  }

  try {
    await petController.updatePet(id, petAtualizado);
    await agendamentoController.updateAgendamentoPet(nomeAntigo, nome);
    res.redirect('/pets/pets');
  } catch (error) {
    res.status(500).json({ error: 'Ocorreu um erro ao atualizar o pet.' });
  }
});

router.delete('/:id/:nome', async (req, res) => {
  const petId = req.params.id;
  const nomePet = req.params.nome;
  const ObjIdPet = new ObjectId(petId);
  petController.deletePet(ObjIdPet)
    .then((result) => {
      agendamentoController.deleteAgendamentoPet(nomePet)
        .then(() => {
          res.status(200).json({ result: result + "Pet deletado." });
        }).catch((error) => {
          res.status(500).json({ error: error + 'Ocorreu um erro ao remover o pet do sistema.' });
        });
    })
    .catch((error) => {
      res.status(500).json({ error: error + 'Ocorreu um erro ao remvoer o agendamento com o pet parametrizado.' });
    });
});

router.post('/', async (req, res) => {
  const { nome, idade, porte, tipo, peso, nomeCliente } = req.body;

  const novoPet = {
    nome,
    idade,
    porte,
    tipo,
    peso,
    nomeCliente,
    timestamp: new Date().getTime(),
  };

  const { error } = validation.validatePet(novoPet);
  if (error) {
    return res.render('criarPet', { error: error.details[0].message });
  }

  petController.createPet(novoPet)
    .then(() => {
      res.redirect('/pets/pets')
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao inserir o pet.' });
    });
});

router.get('/carregarPets', async function (req, res) {
  const colaboradorId = req.user.colaboradorId;
  const nomeColaborador = req.user.nome;

  const pets = [
    { colaboradorId: colaboradorId, nome: 'Mel', idade: 1, porte: 'Pequeno', tipo: "Silvestre", peso: 2, nomeCliente: nomeColaborador, timestamp: new Date().getTime() },
    { colaboradorId: colaboradorId, nome: 'Coelho', idade: 2, porte: 'Médio', tipo: "Domestico", peso: 4, nomeCliente: nomeColaborador, timestamp: new Date().getTime() },
    { colaboradorId: colaboradorId, nome: 'Tutu', idade: 3, porte: 'Grande', tipo: "Silvestre", peso: 1, nomeCliente: nomeColaborador, timestamp: new Date().getTime() },
    { colaboradorId: colaboradorId, nome: 'Flop', idade: 4, porte: 'Grande', tipo: "Domestico", peso: 2, nomeCliente: nomeColaborador, timestamp: new Date().getTime() },
    { colaboradorId: colaboradorId, nome: 'Meow', idade: 5, porte: 'Pequeno', tipo: "Domestico", peso: 3, nomeCliente: nomeColaborador, timestamp: new Date().getTime() },
  ];

  try {
    for (const pet of pets) {
      await petController.createPet(pet);
    }
    res.redirect('/pets/pets');
  } catch (error) {
    console.error('Ocorreu um erro ao realizar a carga automática de pets:', error);
    res.status(500).json({ error: 'Ocorreu um erro ao realizar a carga automática de pets.' });
  }
});


module.exports = router;
