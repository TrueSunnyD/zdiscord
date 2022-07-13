/**
 * This file is part of zdiscord.
 * Copyright (C) 2021 Tony/zfbx
 * source: <https://github.com/zfbx/zdiscord>
 *
 * This work is licensed under the Creative Commons
 * Attribution-NonCommercial-ShareAlike 4.0 International License.
 * To view a copy of this license, visit http://creativecommons.org/licenses/by-nc-sa/4.0/
 * or send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042, USA.
 */

 const { MessageButton } = require("discord.js");

 module.exports = {
    name: "pointlist",
    description: "List Donation Points",
    role: "admin",
    
    options: [
        {
            name: "citizenid",
            description: "Citizen ID",
            required: true,
            type: "STRING",
        }
    ],

    run: async (client, interaction, args) => {

        let players = await getLicense(args.citizenid);
        let license = players[0]["license"]

        let ret = await getDonationPoints(license);
        let balance = ret[0]["balance"];

        return interaction.reply({ content: `Donation Points: ${balance}`, ephemeral: false });
    },
};

async function getDonationPoints(license) {
    return await global.exports.oxmysql.query_async("SELECT balance FROM cd_donatorshop WHERE identifier = ?", [license]);
}

async function getLicense(citizenid) {
    return await global.exports.oxmysql.query_async("SELECT license FROM players WHERE citizenid = ?", [citizenid]);
}