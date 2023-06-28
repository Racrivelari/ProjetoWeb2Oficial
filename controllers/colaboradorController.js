const DBConnection = require('../models/DAO');
const ColaboradorModel = require('../models/colaboradorModel.js');

const Validation = require('../middleware/validation');
const validation = new Validation();
class ColaboradorController {
  constructor() {
    this.connection = new DBConnection();
    this.model = null;
  }

  async createColaborador(colaborador) {
    const { error } = validation.validateColaborador(colaborador);
    if (error) {
      throw new Error(error.details[0].message);
    }

    try {
      await this.connection.connect();
      this.model = new ColaboradorModel(this.connection);
      await this.model.createColaborador(colaborador);
    } finally {
      this.connection.close();
    }
  }

  async readColaboradores() {
    try {
      await this.connection.connect();
      this.model = new ColaboradorModel(this.connection);
      return (await this.model.readColaboradores());
    } finally {
      this.connection.close();
    }
  }

  async updateColaborador(idColab, colabAtualizado) {
    const { error } = validation.validateColaborador(colabAtualizado);
    if (error) {
      throw new Error(error.details[0].message);
    }
    try {
      await this.connection.connect();
      this.model = new ColaboradorModel(this.connection);
      await this.model.updateColaborador(idColab, colabAtualizado);
    } finally {
      this.connection.close();
    }
  }

  async deleteColaborador(idColab) {
    try {
      await this.connection.connect();
      this.model = new ColaboradorModel(this.connection);
      await this.model.deleteColaborador(idColab);
    } finally {
      this.connection.close();
    }
  }

  async findOne(query) {
    try {
      await this.connection.connect();
      this.model = new ColaboradorModel(this.connection);
      return await this.model.findOne(query);
    } finally {
      this.connection.close();
    }
  }
}

module.exports = ColaboradorController;
