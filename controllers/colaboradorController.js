const Joi = require('joi');
const DBConnection = require('../models/DAO');
const ColaboradorModel = require('../models/colaboradorModel.js');

class ColaboradorController {
  constructor() {
    this.connection = new DBConnection();
    this.model = null;
  }

  validateColaborador(colaborador) {
    const schema = Joi.object({
      nome: Joi.string().required(),
      email: Joi.string().email().required(),
      senha: Joi.string().required(),
      timestamp: Joi.date().timestamp() 
    });

    return schema.validate(colaborador);  
  }

  async createColaborador(colaborador) {
    const { error } = this.validateColaborador(colaborador);
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
      return(await this.model.readColaboradores());
    } finally {
      this.connection.close();
    }
  }

  async updateColaborador(idColab, colabAtualizado) {
    const { error } = this.validateColaborador(colabAtualizado);
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
