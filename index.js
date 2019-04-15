const neo4j = require('neo4j-driver').v1;
const config = require('config');

const AdventuresArchiveORM = require('./orm');

const main = async () => {
    console.log("++START++");
    const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic(config.get("database.user"), config.get("database.password")));
    const session = driver.session();
    const adventuresArchiveORM = new AdventuresArchiveORM(session);


    console.log('Cleaning DB');
    const dropConstraintsQueries = (await session.run('CALL db.constraints')).records.map(r => 'DROP ' + r._fields[0]);
    for (const q of dropConstraintsQueries) {
        await session.run(q);
    }
    await session.run('MATCH (n) DETACH DELETE n');

    console.log('Initialize Database');
    await adventuresArchiveORM.initialize();
    console.log();
    console.log("==============");
    console.log('|| TEST RUN ||');
    console.log("==============");
    console.log();
    let pictureAux;

    console.log("\n* Create Dungeon Master");
    let dungeonMaster = await adventuresArchiveORM.models.user.createUser({
        name: 'Dungeon Master Jhonny',
        email: 'dm@test.com',
        password: '1234'
    });
    console.log(dungeonMaster);

    console.log("\n* Create and Link Picture to Dungeon Master");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.user.linkPicture(pictureAux, dungeonMaster);
    console.log('SUCCESS');

    console.log("\n* Create Player1");
    let player1 = await adventuresArchiveORM.models.user.createUser({
        name: 'Generic Player #1',
        email: 'player1@test.com',
        password: '1234'
    });
    console.log(player1);

    console.log("\n* Create and Link Picture to Player 1");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.user.linkPicture(pictureAux, player1);
    console.log('SUCCESS');

    console.log("\n* Create Player2");
    let player2 = await adventuresArchiveORM.models.user.createUser({
        name: 'Generic Player #2',
        email: 'player2@test.com',
        password: '1234'
    });
    console.log(player2);

    console.log("\n* Create and Link Picture to Player 2");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.user.linkPicture(pictureAux, player2);
    console.log('SUCCESS');

    console.log("\n* Create Adventure");
    let adventure = await adventuresArchiveORM.models.adventure.create({
        name: 'Test Adventure',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    });
    console.log(adventure);

    console.log("\n* Create and Link Picture to Adventure");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.adventure.linkPicture(pictureAux, adventure);
    console.log('SUCCESS');

    console.log('\n* Link Adventure to Dungeon Master');
    await adventuresArchiveORM.models.user.linkAdventure(dungeonMaster, adventure);
    console.log('SUCCESS');

    console.log('\n* Find Adventure by id');
    adventure = await adventuresArchiveORM.models.adventure.findById(adventure.id);
    console.log(adventure);

    console.log('\n* Create Timeline');
    let timeline = await adventuresArchiveORM.models.timeline.create();
    console.log(timeline);

    console.log('\n* Link Timeline to Adventure');
    await adventuresArchiveORM.models.adventure.linkTimeline(adventure, timeline);
    console.log('SUCCESS');

    console.log('\n* Create Player Character for Player 1');
    let pc1 = await adventuresArchiveORM.models.playerCharacter.create({
        name: 'Generic PC #1'
    });
    console.log(pc1);

    console.log("\n* Create and Link Picture to Generic PC #1");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.playerCharacter.linkPicture(pictureAux, pc1);
    console.log('SUCCESS');

    console.log('\n* Link Player 1 to PlayerCharacter 1');
    await adventuresArchiveORM.models.user.linkPlayerCharacter(player1, pc1);
    console.log('SUCCESS');

    console.log('\n* Create Player Character for Player 2');
    let pc2 = await adventuresArchiveORM.models.playerCharacter.create({
        name: 'Generic PC #2'
    });
    console.log(pc2);

    console.log("\n* Create and Link Picture to Generic PC #2");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.playerCharacter.linkPicture(pictureAux, pc2);
    console.log('SUCCESS');

    console.log('\n* Link Player 2 to PlayerCharacter 2');
    await adventuresArchiveORM.models.user.linkPlayerCharacter(player2, pc2);
    console.log('SUCCESS');

    console.log('\n* Link PlayerCharacter 1 to Adventure');
    await adventuresArchiveORM.models.playerCharacter.linkAdventure(pc1, adventure);
    console.log('SUCCESS');

    console.log('\n* Link PlayerCharacter 2 to Adventure');
    await adventuresArchiveORM.models.playerCharacter.linkAdventure(pc2, adventure);
    console.log('SUCCESS');

    console.log('\n* Create Npc 1');
    let npc1 = await adventuresArchiveORM.models.npc.create({
        name: "Npc 1"
    });
    console.log(npc1);

    console.log("\n* Create and Link Picture to Npc 1");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.npc.linkPicture(pictureAux, npc1);
    console.log('SUCCESS');

    console.log('\n* Link Npc 1 to Adventure');
    await adventuresArchiveORM.models.adventure.linkNpc(adventure, npc1);
    console.log('SUCCESS');

    console.log('\n* Create Npc 2');
    let npc2 = await adventuresArchiveORM.models.npc.create({
        name: "Npc 2"
    });
    console.log(npc2);

    console.log("\n* Create and Link Picture to Npc 2");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.npc.linkPicture(pictureAux, npc2);
    console.log('SUCCESS');

    console.log('\n* Link Npc 2 to Adventure');
    await adventuresArchiveORM.models.adventure.linkNpc(adventure, npc2);
    console.log('SUCCESS');

    console.log('\n* Create Npc 3');
    let npc3 = await adventuresArchiveORM.models.npc.create({
        name: "Npc 3"
    });
    console.log(npc3);

    console.log("\n* Create and Link Picture to Npc 3");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.npc.linkPicture(pictureAux, npc3);
    console.log('SUCCESS');

    console.log('\n* Link Npc 3 to Adventure');
    await adventuresArchiveORM.models.adventure.linkNpc(adventure, npc3);
    console.log('SUCCESS');

    console.log('\n* Create Organization 1');
    let organization1 = await adventuresArchiveORM.models.organization.create({
        name: "Organization 1"
    });
    console.log(organization1);

    console.log("\n* Create and Link Picture to Organization 1");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.organization.linkPicture(pictureAux, organization1);
    console.log('SUCCESS');

    console.log("\n* Create and Link Picture to Organization 1");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.organization.linkPicture(pictureAux, organization1);
    console.log('SUCCESS');

    console.log("\n* Create and Link Picture to Organization 1");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.organization.linkPicture(pictureAux, organization1);
    console.log('SUCCESS');

    console.log('\n* Link Organization 1 to Adventure');
    await adventuresArchiveORM.models.adventure.linkOrganization(adventure, organization1);
    console.log('SUCCESS');

    console.log('\n* Link Npc 1 to Organization 1');
    await adventuresArchiveORM.models.organization.linkNpc(organization1, npc1);
    console.log('SUCCESS');

    console.log('\n* Link Npc 2 to Organization 1');
    await adventuresArchiveORM.models.organization.linkNpc(organization1, npc2);
    console.log('SUCCESS');

    console.log('\n* Create Map 1');
    let map1 = await adventuresArchiveORM.models.mapDungeon.create({
        name: "Map 1"
    });
    console.log(map1);

    console.log("\n* Create and Link Picture to Map 1");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.mapDungeon.linkPicture(pictureAux, map1);
    console.log('SUCCESS');

    console.log('\n* Link Map 1 to Adventure');
    await adventuresArchiveORM.models.adventure.linkMapDungeon(adventure, map1);
    console.log('SUCCESS');

    console.log('\n* Create Map 2');
    let map2 = await adventuresArchiveORM.models.mapDungeon.create({
        name: "Map 2"
    });
    console.log(map2);

    console.log("\n* Create and Link Picture to Map 2");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.mapDungeon.linkPicture(pictureAux, map2);
    console.log('SUCCESS');

    console.log('\n* Link Map 2 to Adventure');
    await adventuresArchiveORM.models.adventure.linkMapDungeon(adventure, map2);
    console.log('SUCCESS');

    console.log('\n* Create Dungeon 1');
    let dungeon1 = await adventuresArchiveORM.models.mapDungeon.create({
        name: "Dungeon 1"
    });
    console.log(dungeon1);

    console.log("\n* Create and Link Picture to Dungeon 1");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.mapDungeon.linkPicture(pictureAux, dungeon1);
    console.log('SUCCESS');

    console.log('\n* Link Dungeon 1 to Adventure');
    await adventuresArchiveORM.models.adventure.linkMapDungeon(adventure, dungeon1);
    console.log('SUCCESS');

    console.log('\n* Create Location 1');
    let location1 = await adventuresArchiveORM.models.location.create({
        name: "Location 1"
    });
    console.log(location1);

    console.log("\n* Create and Link Picture to Location 1");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.location.linkPicture(pictureAux, location1);
    console.log('SUCCESS');

    console.log("\n* Create and Link Picture to Location 1");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.location.linkPicture(pictureAux, location1);
    console.log('SUCCESS');

    console.log('\n* Link Location 1 to Adventure');
    await adventuresArchiveORM.models.adventure.linkLocation(adventure, location1);
    console.log('SUCCESS');

    console.log('\n* Link Location 1 to Map 1');
    await adventuresArchiveORM.models.location.linkMapDungeon(location1, map1);
    console.log('SUCCESS');

    console.log('\n* Create Location 2');
    let location2 = await adventuresArchiveORM.models.location.create({
        name: "Location 2"
    });
    console.log(location2);

    console.log("\n* Create and Link Picture to Location 2");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.location.linkPicture(pictureAux, location2);
    console.log('SUCCESS');

    console.log('\n* Link Location 2 to Adventure');
    await adventuresArchiveORM.models.adventure.linkLocation(adventure, location2);
    console.log('SUCCESS');

    console.log('\n* Link Location 2 to Map 1');
    await adventuresArchiveORM.models.location.linkMapDungeon(location2, map1);
    console.log('SUCCESS');

    console.log('\n* Create Location 3');
    let location3 = await adventuresArchiveORM.models.location.create({
        name: "Location 3"
    });
    console.log(location3);

    console.log("\n* Create and Link Picture to Location 3");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.location.linkPicture(pictureAux, location3);
    console.log('SUCCESS');

    console.log("\n* Create and Link Picture to Location 3");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.location.linkPicture(pictureAux, location3);
    console.log('SUCCESS');

    console.log('\n* Link Location 3 to Adventure');
    await adventuresArchiveORM.models.adventure.linkLocation(adventure, location3);
    console.log('SUCCESS');

    console.log('\n* Link Location 3 to Map 2');
    await adventuresArchiveORM.models.location.linkMapDungeon(location3, map1);
    console.log('SUCCESS');

    console.log('\n* Create Location 4');
    let location4 = await adventuresArchiveORM.models.location.create({
        name: "Location 4"
    });
    console.log(location4);

    console.log("\n* Create and Link Picture to Location 4");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.location.linkPicture(pictureAux, location4);
    console.log('SUCCESS');

    console.log('\n* Link Location 4 to Adventure');
    await adventuresArchiveORM.models.adventure.linkLocation(adventure, location4);
    console.log('SUCCESS');

    console.log('\n* Link Location 4 to Dungeon 1');
    await adventuresArchiveORM.models.location.linkMapDungeon(location4, dungeon1);
    console.log('SUCCESS');

    console.log('\n* Create Location 5');
    let location5 = await adventuresArchiveORM.models.location.create({
        name: "Location 5"
    });
    console.log(location5);

    console.log("\n* Create and Link Picture to Location 5");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.location.linkPicture(pictureAux, location5);
    console.log('SUCCESS');

    console.log('\n* Link Location 5 to Adventure');
    await adventuresArchiveORM.models.adventure.linkLocation(adventure, location5);
    console.log('SUCCESS');


    console.log('\n* Create Event 1');
    console.log('\n Npc2 said that Npc3 can\'t be trusted and he was last seen in Location 3 by Generic PC #2.')
    let event1 = await adventuresArchiveORM.models.timelineEvent.create({
        name: "Event 1",
        description: `@${npc2.id} said that @${npc3.id} can\\'t be trusted and he was last seen in @${location3.id} by @${pc2.id}.`,
        date: 1
    });
    console.log(event1);

    console.log("\n* Create and Link Picture to Event 1");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.timelineEvent.linkPicture(pictureAux, event1);
    console.log('SUCCESS');

    console.log("\n* Create and Link Picture to Event 1");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.timelineEvent.linkPicture(pictureAux, event1);
    console.log('SUCCESS');

    console.log("\n* Create and Link Picture to Event 1");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.timelineEvent.linkPicture(pictureAux, event1);
    console.log('SUCCESS');

    console.log('\n* Link Event 1 to Timeline');
    await adventuresArchiveORM.models.timeline.linkEvent(timeline, event1);
    console.log('SUCCESS');

    console.log('\n* Link Event 1 to Npc 3');
    await adventuresArchiveORM.models.npc.linkEvent(npc3, event1);
    console.log('SUCCESS');

    console.log('\n* Link Event 1 to Npc 2');
    await adventuresArchiveORM.models.npc.linkEvent(npc2, event1);
    console.log('SUCCESS');

    console.log('\n* Link Event 1 to PlayerCharacter 2');
    await adventuresArchiveORM.models.playerCharacter.linkEvent(pc2, event1);
    console.log('SUCCESS');

    console.log('\n* Link Event 1 to Location 3');
    await adventuresArchiveORM.models.location.linkEvent(location3, event1);
    console.log('SUCCESS');

    console.log('\n* Create Event 2');
    console.log('\n The party defeated Npc 3, but he fled to Location 5. They must now go to Location 2 to meet with Npc 1, the leader of Organization 1.')
    let event2 = await adventuresArchiveORM.models.timelineEvent.create({
        name: "Event 2",
        description: `The party defeated @${npc3.id}, but he fled to @${location5.id}. They must now go to #${location2.id} to meet with @${npc1.id}, the leader of @${organization1.id}.`,
        date: 2
    });
    console.log(event2);

    console.log("\n* Create and Link Picture to Event 2");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.timelineEvent.linkPicture(pictureAux, event2);
    console.log('SUCCESS');

    console.log("\n* Create and Link Picture to Event 2");
    pictureAux = await adventuresArchiveORM.models.picture.create({
        url: 'https://placekitten.com/200/200'
    });
    await adventuresArchiveORM.models.timelineEvent.linkPicture(pictureAux, event2);
    console.log('SUCCESS');

    console.log('\n* Link Event 2 to Timeline');
    await adventuresArchiveORM.models.timeline.linkEvent(timeline, event2);
    console.log('SUCCESS');

    console.log('\n* Link Event 2 to Npc 3');
    await adventuresArchiveORM.models.npc.linkEvent(npc3, event2);
    console.log('SUCCESS');

    console.log('\n* Link Event 2 to Npc 1');
    await adventuresArchiveORM.models.npc.linkEvent(npc1, event2);
    console.log('SUCCESS');

    console.log('\n* Link Event 2 to Location 5');
    await adventuresArchiveORM.models.location.linkEvent(location5, event2);
    console.log('SUCCESS');

    console.log('\n* Link Event 2 to Location 2');
    await adventuresArchiveORM.models.location.linkEvent(location2, event2);
    console.log('SUCCESS');

    console.log('\n* Link Event 2 Organization 1');
    await adventuresArchiveORM.models.organization.linkEvent(organization1, event2);
    console.log('SUCCESS');






    // console.log('\n* ');





    session.close();
    driver.close();
    console.log("++END++");
}
main();