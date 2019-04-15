const config = require('config');
const Joi = require('joi');
const BaseModel = require('../basemodel');

class Organization extends BaseModel {
    constructor(session) {
        super(session);
        this.label = 'Organization';
        this.rules = [...this.rules];
        this.schema = {
            ...this.schema,
            name: Joi.string(),
            description: Joi.string(),
        }
    }
    
    async linkPicture(organization, picture) {
        return await this.createRelationship(organization, '-', 'HAS_PICTURE', '->', picture);
    }

    async linkLocation(organization, location) {
        return await this.createRelationship(organization, '-', 'CURRENTLY_IN_LOCATION', '->', location);
    }
    
    async linkEvent(organization, event) {
        return await this.createRelationship(organization, '-', 'PARTICIPATED_IN_EVENT', '->', event);
    }
    
    async linkNpc(organization, npc) {
        return await this.createRelationship(organization, '-', 'HAS_NPC', '->', npc);
    }
}

module.exports = Organization;