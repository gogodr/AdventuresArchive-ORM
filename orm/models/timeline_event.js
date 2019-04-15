const config = require('config');
const Joi = require('joi');
const BaseModel = require('../basemodel');

class TimelineEvent extends BaseModel {
    constructor(session) {
        super(session);
        this.label = 'TimelineEvent';
        this.rules = [...this.rules];
        this.schema = {
            ...this.schema,
            name: Joi.string(),
            description: Joi.string(),
            date: Joi.number().integer()
        }
    }

    async linkPicture(timelineEvent, picture) {
        return await this.createRelationship(timelineEvent, '-', 'HAS_PICTURE', '->', picture);
    }

    async linkMapDungeon(timelineEvent, mapDungeon) {
        return await this.createRelationship(timelineEvent, '-', 'LOCATED_IN_MAP_DUNGEON', '->', mapDungeon);
    }
}

module.exports = TimelineEvent;