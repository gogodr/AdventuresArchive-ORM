const config = require('config');
const Joi = require('joi');
const BaseModel = require('../basemodel');

class Npc extends BaseModel {
    constructor(session) {
        super(session);
        this.label = 'Npc';
        this.rules = [...this.rules];
        this.schema = {
            ...this.schema,
            name: Joi.string(),
            description: Joi.string(),
        }
    }

    async linkPicture(npc, picture) {
        return await this.createRelationship(npc, '-', 'HAS_PICTURE', '->', picture);
    }

    async linkEvent(npc, event) {
        return await this.createRelationship(npc, '-', 'PARTICIPATED_IN_EVENT', '->', event);
    }

    async linkLocation(npc, location) {
        return await this.createRelationship(npc, '-', 'IS_AT_LOCATION', '->', location);
    }
}

module.exports = Npc;