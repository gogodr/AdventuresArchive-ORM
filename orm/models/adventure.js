const config = require('config');
const Joi = require('joi');
const BaseModel = require('../basemodel');

class Adventure extends BaseModel {
    constructor(session) {
        super(session);
        this.label = 'Adventure';
        this.rules = [...this.rules];
        this.schema = {
            ...this.schema,
            name: Joi.string(),
            description: Joi.string()
        }
    }

    async linkPicture(adventure, picture) {
        return await this.createRelationship(adventure, '-', 'HAS_PICTURE', '->', picture);
    }

    async linkNpc(adventure, npc) {
        return await this.createRelationship(adventure, '-', 'HAS_NPC', '->', npc);
    }

    async linkOrganization(adventure, organization) {
        return await this.createRelationship(adventure, '-', 'HAS_ORGANIZATION', '->', organization);
    }

    async linkTimeline(adventure, timeline) {
        return await this.createRelationship(adventure, '-', 'HAS_TIMELINE', '->', timeline);
    }

    async linkMapDungeon(adventure, mapDungeon) {
        return await this.createRelationship(adventure, '-', 'HAS_MAP_DUNGEON', '->', mapDungeon);
    }

    async linkLocation(adventure, location) {
        return await this.createRelationship(adventure, '-', 'HAS_LOCATION', '->', location);
    }
}

module.exports = Adventure;