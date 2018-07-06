const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DialogChain = require('../modules/dialogChain');
const Dailog = require('../modules/dialog');

const ServerSchema = new Schema({

    name: String,
    id: String,
    ownerID: String,
    region: String,
    defaultChannelID: String,
    botChannelID: String,
    musicChannelID: String,
    joinLeaveChannelID: String

});

const DiscordServer = mongoose.model("server", ServerSchema);

module.exports = {

    server: DiscordServer,

    joinServer(guild) {

        let questions = ["Bot channel ID?", "Music channel ID?", "Join/Leave Channel ID?"];

        let dialogChain = new DialogChain(null, [], "Let's setup the ship!", "That's all Cap'n. You can always change me channels later!");

        questions.map( (question) => {

            let dialog = new Dailog(question);

            dialogChain.addDialog(dialog);
        })

        let channels = guild.channels.filter(channel => channel.type === 'text');
        
        dialogChain.initDialog(guild.owner, (cb) => {

            let guildDefaultChannelID = channels.array()[0].id;

            let serverToJoin = new DiscordServer({

                name: guild.name,
                id: guild.id,
                ownerID: guild.ownerID,
                region: guild.region,
                defaultChannelID: guildDefaultChannelID,
                botChannelID: cb[0].answer || guildDefaultChannelID,
                musicChannelID: cb[1].answer || guildDefaultChannelID,
                joinLeaveChannelID: cb[2].answer || guildDefaultChannelID
    
            })

            serverToJoin.save( (err) => { if (err) throw err });
        });
    },

    changeChannelID(query, channelIDUpdate) {

        DiscordServer.findOneAndUpdate(query, { $set: channelIDUpdate}, (err) => {

            if (err) throw err;
        })
    }

}