const { ObjectId } = require('mongodb');

class ColaboradorDAO {
    constructor(connection) {
        this.connection = connection;
        this.collection = this.connection.database.collection("colaboradores");
    }

    async createColaborador(colaborador) {
        try {
            colaborador.timestamp = new Date(); 
            const result = await this.collection.insertOne(colaborador);
            console.log('Colaborador inserido: ' + result.insertedId);
        } catch (error) {
            console.error('Erro ao inserir colaborador', error);
        }
    }

    async readColaboradores() {
        try {
            const colaboradores = await this.collection.find().toArray();
            return(colaboradores)
        } catch (error) {
            console.error('Erro ao ler colaboradores:', error);
        }
    }

    async updateColaborador(filter, updateColab) {
        try {
            const query = { _id: new ObjectId(filter) };
            const update = { $set: updateColab };
            const result = await this.collection.updateOne(query, update);
            console.log('Colaborador atualizado:', result.modifiedCount);
        } catch (error) {
            console.error('Erro ao atualizar o colaborador:', error);
        }
    }

    async deleteColaborador(idColab) {
        try {
            const result = await this.collection.deleteOne({ _id: idColab });
            console.log('Colaborador removido:', result.deletedCount);
        } catch (error) {
            console.error('Erro ao remover colaborador:', error);
        }
    }

    async findOne(query) {
        try {
            const result = await this.collection.findOne(query);
            return (result);
        } catch (error) {
            console.error('Erro ao buscar colaborador', error);
        }
      }

}

module.exports = ColaboradorDAO;
