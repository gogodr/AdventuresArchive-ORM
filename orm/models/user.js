const config = require('config');
const Joi = require('joi');
const crypto = require('crypto');
const BaseModel = require('../basemodel');

class User extends BaseModel {
    constructor(session) {
        super(session);
        this.label = 'User';
        this.rules = [...this.rules, {
            key: 'email',
            contraints: ['required', 'unique']
        }];
        this.schema = {
            ...this.schema,
            name: Joi.string(),
            email: Joi.string()
        }
    }

    async createUser({ email, password, name }) {
        return await this.create({
            'name': name,
            'email': email,
            'password': crypto
                .createHmac('sha256', config.get('secret'))
                .update(password)
                .digest('base64')
        });
    }
    
    async linkPicture(user, picture) {
        return await this.createRelationship(user, '-', 'HAS_PICTURE', '->', picture);
    }

    async linkAdventure(user, adventure) {
        return await this.createRelationship(user, '-', 'HAS_ADVENTURE', '->', adventure);
    }

    async linkPlayerCharacter(user, playerCharacter) {
        return await this.createRelationship(user, '-', 'HAS_PLAYER_CHARACTER', '->', playerCharacter);
    }

}

module.exports = User;