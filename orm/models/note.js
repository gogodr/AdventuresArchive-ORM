const config = require('config');
const Joi = require('joi');
const BaseModel = require('../basemodel');

class Note extends BaseModel {
    constructor(session) {
        super(session);
        this.label = 'Note';
        this.rules = [...this.rules];
        this.schema = {
            ...this.schema,
            title: Joi.string(),
            description: Joi.string(),
            date: Joi.date()
        }
    }

    async linkPicture(note, picture) {
        return await this.createRelationship(note, '-', 'HAS_PICTURE', '->', picture);
    }

    async linkPlayerCharacter(note, playerCharacter) {
        return await this.createRelationship(note, '-', 'REFERENCES_PC', '->', playerCharacter);
    }

    async linkTimelineEvent(note, timelineEvent) {
        return await this.createRelationship(note, '-', 'REFERENCES_TIMELINE_EVENT', '->', timelineEvent);
    }

    async linkLocation(note, location) {
        return await this.createRelationship(note, '-', 'REFERENCES_LOCATION', '-', location);
    }

    async linkNpc(note, npc) {
        return await this.createRelationship(note, '-', 'REFERENCES_NPC', '-', npc);
    }

    async linkOrganization(note, organization) {
        return await this.createRelationship(note, '-', 'REFERENCES_ORGANIZATION', '->', organization);
    }
}

module.exports = Note;