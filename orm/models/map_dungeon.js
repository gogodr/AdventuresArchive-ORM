const config = require('config');
const Joi = require('joi');
const BaseModel = require('../basemodel');

class MapDungeon extends BaseModel {
    constructor(session) {
        super(session);
        this.label = 'MapDungeon';
        this.rules = [...this.rules];
        this.schema = {
            ...this.schema,
            name: Joi.string(),
            description: Joi.string(),
        }
    }

    async linkPicture(mapDungeon, picture) {
        return await this.createRelationship(mapDungeon, '-', 'HAS_PICTURE', '->', picture);
    }
}

module.exports = MapDungeon;