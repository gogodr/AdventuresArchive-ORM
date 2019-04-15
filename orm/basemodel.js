const uuidv4 = require('uuid/v4');
const Joi = require('joi');

class BaseModel {
    constructor(session) {
        this.session = session;
        this.label = '';
        this.rules = [{
            key: 'id',
            contraints: ['required', 'unique']
        }];
        this.schema = {
            id: Joi.string().guid()
        }
    }

    _parseFindFilters(filters) {
        return filter.reduce((a, b) => a + `${(b.op || '').toUpperCase()} n.${b.param} = ${this._valueToGraphValue(b.value)} `, '').trim()
    }

    _valueToGraphValue(val) {
        switch (typeof val) {
            case 'string':
                return `'${val}'`;
            case 'boolean':
                return 'TRUE' ? val : 'FALSE';
            default:
                return val
        }
    }

    _jsonToGraphMap(obj) {
        return `{${Object.keys(obj).map(key => `${key}:${this._valueToGraphValue(obj[key])}`).join(', ')}}`;
    }

    async _makeUniqueConstraint(param) {
        await this.session.run(`CREATE CONSTRAINT ON (${this.label.toLowerCase()}:${this.label}) ASSERT ${this.label.toLowerCase()}.${param} IS UNIQUE`);
    }
    async _parseNode(rawNode) {
        return {
            _label: rawNode.node.labels[0],
            ...rawNode.node.properties,
            neighbours: (rawNode.neighbours || []).map(n => {
                return {
                    _label: n.labels[0],
                    _relationship: n.relationship,
                    id: n.id,
                    name: n.name
                }
            })
        }
    }

    async initialize() {
        console.log(`Initialize ${this.label} Model`);
        this._createSchema = { ...this.schema };
        for (let rule of this.rules) {
            for (let c of rule.contraints) {
                switch (c) {
                    case 'unique':
                        console.log(`--- Register unique constraint for ${this.label}.${rule.key}`);
                        await this._makeUniqueConstraint(rule.key);
                        break;
                    case 'required':
                        this._createSchema[rule.key] = this._createSchema[rule.key].required();
                        break;
                }
            }
        }
    }

    async create(obj) {
        let r = {};
        for (let key in obj) {
            if (obj[key] !== undefined) {
                r[key] = obj[key];
            }
        }
        const validationResult = Joi.validate(r, Joi.object().keys(this._createSchema));
        if (!validationResult.error) {
            throw validationResult.error;
        }
        return this._parseNode((await this.session.run(`CREATE(n:${this.label} ${this._jsonToGraphMap({ id: uuidv4(), ...r })}) RETURN {node:n}`)).records[0].get(0));
    }

    async findById(uuid) {
        return this._parseNode((await this.session.run(`MATCH (n:${this.label})-[r]-(x) WHERE n:${this.label} AND n.id = '${uuid}' RETURN {node:n, neighbours:collect({labels: labels(x), name:x.name, id:x.id, relationship:type(r)})}`)).records[0].get(0));
    }

    // filters: [{"param":"id","value":3},{"op":"AND","param":"a","value":"test"},{"op":"OR","param":"id","value":4}]
    async findAll(filters) {
        let query = `MATCH (n:${this.label})`;
        if ((filters || []).length > 0) {
            query += ` WHERE ${this._parseFindFilters(filters)}`;
        }
        query += ' RETURN collect({node:n})';
        return (await this.session.run(query)).records;
    }

    async update(uuid, params) {
        const validationResult = Joi.validate(obj, Joi.object().keys(this.schema));
        if (!validationResult.error) {
            throw validationResult.error;
        }
        return this._parseNode((await this.session.run(`MATCH (n:${this.label} {id:'${uuid}'}) SET n += ${this._jsonToGraphMap(params)} RETURN {node:n}`)).records[0].get(0));
    }

    async delete(uuid) {
        await this.session.run(`MATCH (n:${this.label} {id:${uuid}}) DELETE n`);
    }


    async createRelationship(nodeA, leftHandle, relationship, rightHandle, nodeB) {
        return (await this.session.run(`MATCH (na:${nodeA._label} {id:'${nodeA.id}'}), (nb:${nodeB._label} {id:'${nodeB.id}'}) CREATE (na)${leftHandle}[r:${relationship}]${rightHandle}(nb) RETURN count(r)`)).records[0].get(0);
    }
}

module.exports = BaseModel;