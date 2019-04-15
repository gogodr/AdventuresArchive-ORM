const Adventure = require('./models/adventure');
const Location = require('./models/location');
const MapDungeon = require('./models/map_dungeon');
const Note = require('./models/note');
const Npc = require('./models/npc');
const Organization = require('./models/organization');
const Picture = require('./models/picture');
const PlayerCharacter = require('./models/player_character');
const TimelineEvent = require('./models/timeline_event');
const Timeline = require('./models/timeline');
const User = require('./models/user');

class AdventuresArchiveORM {
    constructor(session) {
        this.session = session;
        this.models = {};
    }

    async initialize() {
        console.log(`++ Initialize AdventuresArchiveORM`);
        this.models = {
            adventure: new Adventure(this.session),
            location: new Location(this.session),
            mapDungeon: new MapDungeon(this.session),
            note: new Note(this.session),
            npc: new Npc(this.session),
            organization: new Organization(this.session),
            picture: new Picture(this.session),
            playerCharacter: new PlayerCharacter(this.session),
            timelineEvent: new TimelineEvent(this.session),
            timeline: new Timeline(this.session),
            user: new User(this.session),
        }
        for (let key in this.models) {
            await this.models[key].initialize();
        }
    }

}

module.exports = AdventuresArchiveORM;