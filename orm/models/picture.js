const config = require('config');
const Joi = require('joi');
const BaseModel = require('../basemodel');

class Picture extends BaseModel {
    constructor(session) {
        super(session);
        this.label = 'Picture';
        this.rules = [...this.rules, {
            key: 'url',
            contraints: ['required']
        }];
        this.schema = {
            ...this.schema,
            url: Joi.string()
        }
    }
}

module.exports = Picture;