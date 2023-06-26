const express = require('express');
const router = express.Router();

const { ObjectId } = require('mongodb');

const PetController = require('../controllers/petController');
const petController = new PetController();

// const AgendamentoController = require('../controllers/agendamentoController');
// const agendamentoController = new AgendamentoController();

const auth = require('../middleware/auth')
router.use(auth);
router.get('/', (req, res) => {

});

router.get('/criarPet', (req, res) => {
  res.render('criarPet');
});

// router.get('/editarPet/:id', (req, res) => {
//   const petId = req.params.id;

//   const ObjIdPet = new ObjectId(petId);
//   petController.findOne(ObjIdPet)
//     .then((pets) => {
//       res.render('editarPet', { pets });
//     })
//     .catch((error) => {
//       res.status(500).json({ error: 'Ocorreu um erro ao buscar pet.' });
//     });
// });

// router.post('/editarPet', (req, res) => {
//   const { id, nome, idade, porte, tipo, peso, nomeAntigo } = req.body;
//   const petAtualizado = {
//     nome,
//     idade,
//     porte,
//     tipo,
//     peso,
//     timestamp: new Date().getTime(), 
//   };

//   petController.updatePet(id, petAtualizado)
//     .then(() => {
//       agendamentoController.updateAgendamentoPet(nomeAntigo, nome)
//         .then(() => {
//           res.redirect('/pets');
//         }).catch((error) => {
//           res.status(500).json({ error: 'Ocorreu um erro ao atualizar o pet1.' });
//         });
//     })
//     .catch((error) => {
//       res.status(500).json({ error: 'Ocorreu um erro ao atualizar o pet2.' });
//     });
// });

// router.delete('/:id/:nome', (req, res) => {
//   const petId = req.params.id;
//   const nomePet = req.params.nome;
//   const ObjIdPet = new ObjectId(petId);
//   console.log(produto)
//   petController.deletePet(ObjIdPet)
//     .then((result) => {
//       agendamentoController.deleteAgendamentoPet(nomePet)
//         .then(() => {
//           res.status(200).json({ result: result + "Pet deletado." });
//         }).catch((error) => {
//           res.status(500).json({ error: error + 'Ocorreu um erro ao remover o pet do sistema.' });
//         });
//     })
//     .catch((error) => {
//       res.status(500).json({ error: error + 'Ocorreu um erro ao remvoer o agendamento com o pet parametrizado.' });
//     });
// });

router.post('/', (req, res) => {
  const { nome, idade, porte, tipo, peso } = req.body;

  const novoPet = {
    nome,
    idade,
    porte,
    tipo,
    peso,
    timestamp: new Date().getTime(), 
  };

  petController.createPet(novoPet)
    .then(() => {
      res.redirect('/pets')
    })
    .catch((error) => {
      res.status(500).json({ error: 'Ocorreu um erro ao inserir o pet.' });
    });
});
module.exports = router;
