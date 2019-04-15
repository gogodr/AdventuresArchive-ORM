const config = require('config');
const Joi = require('joi');
const BaseModel = require('../basemodel');

class Timeline extends BaseModel {
    constructor(session) {
        super(session);
        this.label = 'Timeline';
        this.rules = [...this.rules];
        this.schema = {
            ...this.schema
        }
    }

    async linkEvent(timeline, event) {
        return await this.createRelationship(timeline, '-', 'HAS_EVENT', '->', event);
    }
}

module.exports = Timeline;