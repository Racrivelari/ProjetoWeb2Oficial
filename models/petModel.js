const { query } = require('express');
const { ObjectId } = require('mongodb');
class PetDAO {
    constructor(connection) {
        this.connection = connection;
        this.collection = this.connection.database.collection("pets");
    }

    async createPet(pet) {
        try {
            pet.timestamp = new Date();
            const result = await this.collection.insertOne(pet);
            console.log('Pet inserido: ' + result.insertedId);
        } catch (error) {
            console.error('Erro ao inserir pet', error);
        }
    }

    async readPets() {
        try {
            const pets = await this.collection.find().toArray();
            return(pets)
        } catch (error) {
            console.error('Erro ao ler pets:', error);
        }
    }

    async updatePet(idPet, petAtualizado) {
        try {
            const id = {_id: new ObjectId(idPet)};
            const att = {$set: petAtualizado};
            const result = await this.collection.updateOne(id, att);
            console.log('Pet atualizado:', result.modifiedCount);
        } catch (error) {
            console.error('Erro ao atualizar pet:', error);
        }
    }

    async deletePet(idPet) {
        try {
            const result = await this.collection.deleteOne({ _id: idPet });
            console.log('Pet removido:', result.deletedCount);
        } catch (error) {
            console.error('Erro ao remover pet:', error);
        }
    }

    async findOne(query) {
        try {
            const result = await this.collection.findOne({_id : query});
            return (result);
        } catch (error) {
            console.error('Erro ao buscar pet', error);
        }
      }
    
    async findOneByNome(query) {
        try {
            const result = await this.collection.findOne({nome : query});
            return (result);
        } catch (error) {
            console.error('Erro ao buscar pet pelo nome', error);
        }
    }

}

module.exports = PetDAO;
