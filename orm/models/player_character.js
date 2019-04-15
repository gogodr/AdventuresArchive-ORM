const config = require('config');
const Joi = require('joi');
const BaseModel = require('../basemodel');

class PlayerCharacter extends BaseModel {
    constructor(session) {
        super(session);
        this.label = 'PlayerCharacter';
        this.rules = [...this.rules];
        this.schema = {
            ...this.schema,
            name: Joi.string(),
            description: Joi.string()
        }
    }

    async linkPicture(playerCharacter, picture) {
        return await this.createRelationship(playerCharacter, '-', 'HAS_PICTURE', '->', picture);
    }

    async linkEvent(playerCharacter, event) {
        return await this.createRelationship(playerCharacter, '-', 'PARTICIPATED_IN_EVENT', '->', event);
    }

    async linkAdventure(playerCharacter, adventure) {
        return await this.createRelationship(playerCharacter, '-', 'PLAYS_IN_ADVENTURE', '->', adventure);
    }
}

module.exports = PlayerCharacter;