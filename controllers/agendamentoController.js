const Joi = require('joi');
const DBConnection = require('../models/DAO');
const AgendamentoModel = require('../models/agendamentoModel.js');

class AgendamentoController {
    constructor() {
        this.connection = new DBConnection();
        this.model = null;
    }

    validateAgendamento(agendamento) {
        const schema = Joi.object({
          pet: Joi.string().required(),
          tipoAgendamento: Joi.string().valid('Consulta', 'Tosa', 'Banho'),
          data: Joi.string().required(),
          nomeColaborador: Joi.string().required(),
          colaboradorId: Joi.string().required(),
          timestamp: Joi.date().timestamp() 
        });
        return schema.validate(agendamento);  
      }

    async createAgendamento(agendamento) {

        const { error } = this.validateAgendamento(agendamento);
        if (error) {
            throw new Error(error.details[0].message);
        }

        try {
            await this.connection.connect();
            this.model = new AgendamentoModel(this.connection);
            await this.model.createAgendamento(agendamento);
        } finally {
            this.connection.close();
        }
    }

    async readAgendamentos() {
        try {
            await this.connection.connect();
            this.model = new AgendamentoModel(this.connection);
            return (await this.model.readAgendamentos());
        } finally {
            this.connection.close();
        }
    }

    async updateAgendamento(agendamentoId, novoAgendamento) {
        const { error } = this.validateAgendamento(novoAgendamento);
        if (error) {
            throw new Error(error.details[0].message);
        }

        try {
            await this.connection.connect();
            this.model = new AgendamentoModel(this.connection);
            await this.model.updateAgendamento(agendamentoId, novoAgendamento);
        } finally {
            this.connection.close();
        }
    }

    async updateAgendamentoPet(nome, novoPet) {
        try {
            await this.connection.connect();
            this.model = new AgendamentoModel(this.connection);
            await this.model.updateAgendamentoPet(nome, novoPet);
        } finally {
            this.connection.close();
        }
    }

    async updateAgendamentoColaborador(nome, novoColaborador) {
        try {
            await this.connection.connect();
            this.model = new AgendamentoModel(this.connection);
            await this.model.updateAgendamentoColaborador(nome, novoColaborador);
        } finally {
            this.connection.close();
        }
    }

    async deleteAgendamento(idAgendamento) {
        try {
            await this.connection.connect();
            this.model = new AgendamentoModel(this.connection);
            await this.model.deleteAgendamento(idAgendamento);
        } finally {
            this.connection.close();
        }
    }

    async deleteAgendamentoPet(nome) {
        try {
            await this.connection.connect();
            this.model = new AgendamentoModel(this.connection);
            await this.model.deleteAgendamentoPet(nome);
        } finally {
            this.connection.close();
        }
    }

    async findOne(query) {
        try {
            await this.connection.connect();
            this.model = new AgendamentoModel(this.connection);
            return await this.model.findOne(query);
        } finally {
            this.connection.close();
        }
    }
}

module.exports = AgendamentoController;
