const DBConnection = require('../models/DAO');
const ColaboradorModel = require('../models/colaboradorModel.js');

class ColaboradorController {
  constructor() {
    this.connection = new DBConnection();
    this.model = null;
  }

  async createColaborador(colaborador) {
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
      return(await this.model.readColaboradores());
    } finally {
      this.connection.close();
    }
  }

  async updateColaborador(idColab, colabAtualizado) {
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

  async findById(idColab) {
    try {
      await this.connection.connect();
      this.model = new ColaboradorModel(this.connection);
      return await this.model.findById(idColab);
    } finally {
      this.connection.close();
    }
  }
}

module.exports = ColaboradorController;
