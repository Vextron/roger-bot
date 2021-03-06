"use strict";
//import {token, prefix, dbLink} from "./settings.json";
Object.defineProperty(exports, "__esModule", { value: true });
const Discord = require("discord.js");
const Mongo = require("mongoose");
const CommandHandler_1 = require("./src/components/CommandHandler");
const Server_1 = require("./src/components/Server");
const UserSchema_1 = require("./src/database_models/UserSchema");
const client = new Discord.Client();
client.login(process.env.BOT_TOKEN).then(() => {
});
Mongo.connect(process.env.DB).then(() => {
    console.log("Connected...");
})
    .catch((err) => {
    console.log(err);
});
client.on('guildMemberAdd', member => {
    let channel = client.channels.get("460934242713600013");
    UserSchema_1.createUser(member.displayName, member.id).then(res => {
        channel.send(res);
    });
});
client.on('guildCreate', guild => {
    Server_1.joinServer(guild);
});
client.on('message', message => {
    if (message.content.startsWith("$")) {
        try {
            CommandHandler_1.checkCommands(message);
        }
        catch (error) {
            //message.channel.send(error);
        }
    }
});
//# sourceMappingURL=index.js.map