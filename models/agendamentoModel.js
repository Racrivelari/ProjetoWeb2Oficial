const { ObjectId } = require('mongodb');
class AgendamentoDAO {
    constructor(connection) {
        this.connection = connection;
        this.collection = this.connection.database.collection("agendamentos");
    }

    async createAgendamento(agendamento) {
        try {
            agendamento.timestamp = new Date(); 
            const result = await this.collection.insertOne(agendamento);
            console.log('Agendamento criado:', result.insertedId);
        } catch (error) {
            console.error('Erro ao criar agendamento:', error);
        }
    }

    async readAgendamentos() {
        try {
            const agendamentos = await this.collection.find().toArray();
            return agendamentos;
        } catch (error) {
            console.error('Erro ao ler agendamentos:', error);
        }
    }

    async updateAgendamento(agendamentoId, novoAgendamento) {
        try {
            const query = { _id: new ObjectId(agendamentoId) };
            const update = { $set: novoAgendamento };
            console.log(query)
            const result = await this.collection.updateOne(query, update);
            console.log('Agendamento atualizado :', result.modifiedCount);
        } catch (error) {
            console.error('Erro ao atualizar o agendamento:', error);
            throw error;
        }
    }

    async updateAgendamentoPet(nome, novoPet) {
        try {
          const query = { pet: nome };
          const update = { $set: { pet: novoPet } };
          const result = await this.collection.updateMany(query, update);
          console.log('Agendamentos atualizados:', result.modifiedCount);
        } catch (error) {
          console.error('Erro ao atualizar os agendamentos:', error);
          throw error;
        }
      }

    async deletePedido(agendamentoId) {
        try {
            const result = await this.collection.deleteOne({ _id: agendamentoId });
            console.log(agendamentoId)
            console.log('Agendamento removido:', result.deletedCount);
        } catch (error) {
            console.error('Erro ao remover o agendamento:', error);
        }
    }

    async deleteAgendamentoPet(nome) {
        try {
            const result = await this.collection.deleteMany({ pet: nome });
            console.log('Agendamento removido:', result.deletedCount);
        } catch (error) {
            console.error('Erro ao remover o agendamento:', error);
        }
    }

    async findOne(query) {
        try {
            const result = await this.collection.findOne(query);
            return (result);
        } catch (error) {
            console.error('Erro ao buscar', error);
        }
    }
}

module.exports = AgendamentoDAO;
