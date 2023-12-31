const DBConnection = require('../models/DAO');
const PetModel = require('../models/petModel.js');

const Validation = require('../middleware/validation');
const validation = new Validation();
class PetController {
  constructor() {
    this.connection = new DBConnection();
    this.model = null;
  }

  async createPet(pet) {
    const { error } = validation.validatePet(pet);
    if (error) {
      throw new Error(error.details[0].message);
    }
    try {
      await this.connection.connect();
      this.model = new PetModel(this.connection);
      await this.model.createPet(pet);
    } finally {
      this.connection.close();
    }
  }

  async readPets() {
    try {
      await this.connection.connect();
      this.model = new PetModel(this.connection);
      return (await this.model.readPets());
    } finally {
      this.connection.close();
    }
  }

  async updatePet(idPet, petAtualizado) {
    const { error } = validation.validatePet(petAtualizado);
    if (error) {
      throw new Error(error.details[0].message);
    }
    try {
      await this.connection.connect();
      this.model = new PetModel(this.connection);
      await this.model.updatePet(idPet, petAtualizado);
    } finally {
      this.connection.close();
    }
  }

  async deletePet(idPet) {
    try {
      await this.connection.connect();
      this.model = new PetModel(this.connection);
      await this.model.deletePet(idPet);
    } finally {
      this.connection.close();
    }
  }

  async findOne(query) {
    try {
      await this.connection.connect();
      this.model = new PetModel(this.connection);
      return await this.model.findOne(query);
    } finally {
      this.connection.close();
    }
  }

  async findOneByNome(query) {
    try {
      await this.connection.connect();
      this.model = new PetModel(this.connection);
      return await this.model.findOneByNome(query);
    } finally {
      this.connection.close();
    }
  }

}

module.exports = PetController;
