/**
 *   Adds AGL to user
 *   @param      {String}    realname
 *   @returns    {Object}    agl
 */
import Logger from 'src/libs/Logger';
import state from 'src/libs/state';
export function addAglToUser(realname) {
    let genders = {
        M: ['M002', ' h ', '/H/', ' m ', '^h ', ' h$', '^m ', ' m$', '^h$', '^m$'],
        F: ['F001', ' f ', '/f/', '^f ', ' f$', '^f$'],
        U: ['U003', '/U/'],
    };
    let info;
    let regexList;
    let regexIndex;
    let genderString;
    let age = '';
    let gender = 'U';
    let tempGecos = [];
    let genderIndex;

    for (genderIndex in genders) {
        if (genders[genderIndex] !== '') {
            regexList = genders[genderIndex].join('|');
        }

        // If gender info is in realname
        if (realname.match(new RegExp(regexList, 'i'))) {
            gender = genderIndex;

            // Find the gender info to split realname into ASL
            for (regexIndex in genders[genderIndex]) {
                // Test the different gender regexes
                if (realname.match(new RegExp(genders[genderIndex][regexIndex], 'i'))) {
                    // Clean the gender regex to split the realname around it
                    genderString = genders[genderIndex][regexIndex].replace(/[\^$]/g, '');
                    tempGecos = realname.split(new RegExp(genderString, 'i'));

                    // Push the traling realname into info
                    if (tempGecos.length > 1) {
                        info = tempGecos[1];
                    }
                    // If we've got here we've found all we can so stop looping
                    break;
                }
            }
        }
        // Set the age
        if (tempGecos[0] && tempGecos[0].match(/[0-9]/)) {
            age = tempGecos[0];
        }

        // If we've got an age or a gender at this stage, we've done the job
        if (age !== '' || gender !== 'U') {
            break;
        } else {
            info = realname;
        }
    }
//    Logger.error('AGL', realname, gender);

    return {
        age: age,
        gender: gender,
        location: info,
    };
}

/**
 * Colorize the nickname according to gender
 */
let nickColourCache = Object.create(null);
export function createNickColour(user) {
    let nickColour = '#000000';
    let nickLower = user.nick.toLowerCase();

    if (nickColourCache[nickLower]) {
        return nickColourCache[nickLower];
    }

    if (user.gender === undefined) {
        Logger.error('AGL: ', user.nick, state.getUser(user.nick));
        return nickColour;
    }

    if (nickColourCache[user.nick]) {
        return nickColourCache[user.nick];
    }

    if (user.gender === 'M') {
        nickColour = '#0066FF';
    } else if (user.gender === 'F') {
        nickColour = '#FF00FF';
    }

    nickColourCache[user.nick] = nickColour;

    return nickColour;
}
