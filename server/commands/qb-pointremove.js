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
    name: "pointremove",
    description: "Remove Donation Points",
    role: "god",
    
    options: [
        {
            name: "citizenid",
            description: "Citizen ID",
            required: true,
            type: "STRING",
        },
        {
            name: "amount",
            description: "Amount to remove",
            required: true,
            type: "INTEGER",
        }
    ],

    run: async (client, interaction, args) => {

        let players = await getLicense(args.citizenid);
        let license = players[0]["license"]

        let ret = await getDonationPoints(license);
        let balance = ret[0]["balance"];
        let newbalance = balance - args.amount

        global.exports.oxmysql.update_async("UPDATE cd_donatorshop SET balance = ? WHERE identifier = ?", [
            newbalance,
            license,
        ]);

        return interaction.reply({ content: `New Donation Points: ${newbalance} for ${license}`, ephemeral: false });
    },
};

async function getDonationPoints(license) {
    return await global.exports.oxmysql.query_async("SELECT balance FROM cd_donatorshop WHERE identifier = ?", [license]);
}

async function getLicense(citizenid) {
    return await global.exports.oxmysql.query_async("SELECT license FROM players WHERE citizenid = ?", [citizenid]);
}