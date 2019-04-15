const config = require('config');
const Joi = require('joi');
const BaseModel = require('../basemodel');

class Location extends BaseModel {
    constructor(session) {
        super(session);
        this.label = 'Location';
        this.rules = [...this.rules];
        this.schema = {
            ...this.schema,
            name: Joi.string(),
            description: Joi.string(),
            coords: Joi.object().keys({
                x: Joi.number().required(),
                y: Joi.number().required()
            })
        }
    }

    async linkPicture(location, picture) {
        return await this.createRelationship(location, '-', 'HAS_PICTURE', '->', picture);
    }

    async linkMapDungeon(location, mapDungeon) {
        return await this.createRelationship(location, '-', 'LOCATED_IN_MAP_DUNGEON', '->', mapDungeon);
    }

    async linkEvent(location, event) {
        return await this.createRelationship(location, '-', 'HAS_EVENT', '->', event);
    }
}

module.exports = Location;