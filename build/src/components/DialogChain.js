"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DialogChain {
    constructor(dialogs, beginMessage, endMessage) {
        this.dialogs = [];
        this.fase = 0;
        this.dialogs = dialogs;
        this.beginMessage = beginMessage;
        this.endMessage = endMessage;
    }
    addDialog(dialog) {
        this.dialogs.push(dialog);
    }
    modifyDialog(fase, answer, channel) {
        let dialogToChange = this.dialogs[fase];
        channel.send(dialogToChange.question);
        dialogToChange.setAnswer(answer);
    }
    initDialog(owner) {
        return new Promise((resolve, reject) => {
            owner.createDM().then(channel => {
                let collector = channel.createMessageCollector(m => !m.author.bot);
                channel.send(this.beginMessage);
                channel.send(this.dialogs[0].question);
                collector.on("collect", m => {
                    let content = m.content;
                    if (!!content.match(/done/i))
                        collector.stop();
                    if (!!content.match(/([0-9]{18}|\w{1,20}|\s)/gm)) {
                        this.dialogs[this.fase].setAnswer(content);
                        this.fase++;
                        if (this.fase >= this.dialogs.length)
                            collector.stop();
                        else
                            channel.send(this.dialogs[this.fase].question);
                    }
                    else
                        channel.send("Answer not correctly formated!");
                });
                collector.on('end', () => {
                    channel.send(this.endMessage);
                    resolve(this.dialogs);
                });
                this.fase = 0;
            });
        });
    }
}
exports.default = DialogChain;
//# sourceMappingURL=DialogChain.js.map