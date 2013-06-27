/*jslint white: true, browser: true, devel: true, undef: true,
nomen: true, bitwise: true, plusplus: true,
regexp: true, eqeq: true, newcap: true, forin: false */
/*global window,escape,jQuery,$j,rison,utility,
$u,chrome,CAAP_SCOPE_RUN,self,caap,config,con,feed,image64,gm,
schedule,gifting,state,army, general,session,monster:true,guild_monster */
/*jslint maxlen: 256 */

////////////////////////////////////////////////////////////////////
//                          monster OBJECT
// this is the main object for dealing with Monsters
/////////////////////////////////////////////////////////////////////

(function() {
    "use strict";

    monster.records = [];

    monster.record = function() {
        this.data = {
            'name': '',
            'userName': '',
            'userId': 0,
            'monster': '',
            'md5': '',
            'attacked': -1,
            'defended': -1,
            'damage': -1,
            'life': -1,
            'fortify': -1,
            'time': [],
            't2k': -1,
            'phase': '',
            'miss': 0,
            'feedLink': '',
            'link': '',
            'rix': -1,
            'mpool': '',
            'mid': '',
            'over': '',
            'page': '',
            'color': '',
            'review': -1,
            'type': '',
            'conditions': '',
            'charClass': '',
            'strength': -1,
            'stun': -1,
            'stunTime': -1,
            'stunDo': false,
            'stunType': '',
            'tip': '',
            'fImg': '',
            'hide': false,
            'save': true,
            'joinable': {},
            'joined': false,
            'select': false
        };
    };

    monster.engageButtons = {};

    monster.completeButton = {
        'battle_monster': {
            'name': undefined,
            'button': undefined
        },
        'raid': {
            'name': undefined,
            'button': undefined
        }
    };

    // http://castleage.wikidot.com/monster for monster info
    // http://castleage.wikidot.com/skaar
    monster.info = {
        'Skaar Deathrune': {
            duration: 96,
            defense: true,
            hp: 100000000,
            ach: 1000000,
            siege: 5,
            siegeClicks: [30, 60, 90, 120, 200],
            siegeDam: [6600000, 8250000, 9900000, 13200000, 16500000],
            siege_img: ['/graphics/death_siege_small'],
            fort: true,
            staUse: 5,
            staLvl: [0, 100, 200, 500],
            staMax: [5, 10, 20, 50],
            nrgMax: [10, 20, 40, 100],
            reqAtkButton: 'attack_monster_button.jpg',
            v: 'attack_monster_button2.jpg',
            defButton: 'button_dispel.gif',
            defense_img: 'bar_dispel.gif',
            levels: [1, 30, 60, 90],
            join: [30, 50, 70, 70],
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_skaar_boss.jpg'],
            festival_dur: 120,
            festival_ach: 1000000,
            newbg_img: ['monster_header_skaar.jpg'],
            list_img: ['death_list.jpg'],
            cta_img: ['ntwitter_deathrune1.gif']
        },
        'Ragnarok, The Ice Elemental': {
            duration: 168,
            defense: true,
            hp: 100000000,
            ach: 1000000,
            siege: 5,
            siegeClicks: [30, 60, 90, 120, 200],
            siegeDam: [7260000, 9075000, 10890000, 14520000, 18150000],
            siege_img: ['/graphics/water_siege_small'],
            fort: true,
            staUse: 5,
            staLvl: [0, 100, 200, 500],
            staMax: [5, 10, 20, 50],
            nrgMax: [10, 20, 40, 100],
            reqAtkButton: 'attack_monster_button.jpg',
            pwrAtkButton: 'attack_monster_button2.jpg',
            defButton: 'button_dispel.gif',
            defense_img: 'bar_dispel.gif',
            levels: [1, 30, 60, 90],
            join: [30, 50, 70, 70],
            mClass: 'Epic World',
            mpool: 3,
            festival_img: ['festival_monsters_top_water_element.jpg'],
            festival_dur: 192,
            festival_ach: 1000000,
            newbg_img: ['monster_header_ragnorak.jpg', 'monster_header_ragnarok.jpg'],
            list_img: ['water_list.jpg'],
            cta_img: ['ntwitter_ragnarok1.gif']
        },
        'Genesis, The Earth Elemental': {
            duration: 168,
            defense: true,
            hp: 100000000,
            ach: 1000000,
            siege: 5,
            siegeClicks: [30, 60, 90, 120, 200],
            siegeDam: [6600000, 8250000, 9900000, 13200000, 16500000],
            siege_img: ['/graphics/earth_siege_small'],
            fort: true,
            staUse: 5,
            staLvl: [0, 100, 200, 500],
            staMax: [5, 10, 20, 50],
            nrgMax: [10, 20, 40, 100],
            reqAtkButton: 'attack_monster_button.jpg',
            pwrAtkButton: 'attack_monster_button2.jpg',
            defButton: 'attack_monster_button3.jpg',
            defense_img: 'seamonster_ship_health.jpg',
            repair_img: 'repair_bar_grey.jpg',
            levels: [1, 30, 60, 90],
            join: [30, 30, 30, 40],
            mClass: 'Epic World',
            mpool: 3,
            festival_img: ['festival_monsters_top_earth_element.jpg'],
            festival_dur: 192,
            festival_ach: 1000000,
            newbg_img: ['monster_header_genesis.jpg'],
            list_img: ['earth_element_list.jpg'],
            cta_img: ['ntwitter_genesis1.gif']
        },
        'Cronus, The World Hydra': {
            duration: 168,
            hp: 100000000,
            ach: 500000,
            siege: 6,
            siegeClicks: [10, 20, 50, 100, 200, 300],
            siegeDam: [1340000, 2680000, 5360000, 14700000, 28200000, 37520000],
            siege_img: ['/graphics/monster_siege_small'],
            staUse: 10,
            staLvl: [0, 100, 200, 400, 400],
            staMax: [10, 20, 50, 100, 200],
            levels: [1, 30, 60, 90],
            join: [40, 30, 30, 30],
            mClass: 'Epic World',
            mpool: 3,
            festival_img: ['festival_monsters_top_hydra.jpg'],
            festival_dur: 192,
            festival_ach: 500000,
            newbg_img: ['monster_header_cronus.jpg'],
            list_img: ['hydra_head.jpg'],
            cta_img: [
                'cta_hydra_catapult.gif',
                'cta_hydra_arrows.gif',
                'cta_hydra_cannons.gif',
                'cta_hydra_blizzard.gif',
                'cta_hydra_firestorm.gif']
        },
        'Battle Of The Dark Legion': {
            duration: 168,
            hp: 100000,
            ach: 1000,
            siege: 6,
            siegeClicks: [10, 20, 40, 80, 150, 300],
            siegeDam: [3000, 4500, 6000, 9000, 12000, 15000],
            siege_img: ['/graphics/castle_siege_small'],
            fort: true,
            staUse: 5,
            staLvl: [0, 100, 200, 500],
            staMax: [5, 10, 20, 50],
            nrgMax: [10, 20, 40, 100],
            defense_img: 'seamonster_ship_health.jpg',
            repair_img: 'repair_bar_grey.jpg',
            levels: [1, 30, 60, 90],
            join: [30, 30, 30, 40],
            mClass: 'Epic World',
            mpool: 3,
            newbg_img: ['monster_header_defend.jpg'],
            list_img: ['castle_siege_list.jpg'],
            cta_img: [
                'cta_castle_archers.gif',
                'cta_castle_elves.gif',
                'cta_castle_dwarves.gif',
                'cta_castle_knights.gif']
        },
        'Emerald Dragon': {
            duration: 72,
            ach: 100000,
            siege: 0,
            staUse: 5,
            staMax: [5, 10],
            attack_img: ['seamonster_power.gif', 'serpent_10stam_attack.gif'],
            mClass: 'Epic Team',
            mpool: 2,
            newbg_img: ['monster_header_emeralddrag.jpg'],
            list_img: ['dragon_list_green.jpg'],
            cta_img: ['cta_green_dragon.gif']
        },
        'Frost Dragon': {
            duration: 72,
            ach: 100000,
            siege: 0,
            staUse: 5,
            staMax: [5, 10],
            attack_img: ['seamonster_power.gif', 'serpent_10stam_attack.gif'],
            mClass: 'Epic Team',
            mpool: 2,
            festival_img: ['festival_monsters_top_dragon_blue.jpg'],
            festival_dur: 96,
            festival_ach: 30000,
            newbg_img: ['monster_header_frostdrag.jpg'],
            list_img: ['dragon_list_blue.jpg'],
            cta_img: ['cta_blue_dragon.gif']
        },
        'Gold Dragon': {
            duration: 72,
            ach: 100000,
            siege: 0,
            staUse: 5,
            staMax: [5, 10],
            attack_img: ['seamonster_power.gif', 'serpent_10stam_attack.gif'],
            mClass: 'Epic Team',
            mpool: 2,
            festival_img: ['festival_monsters_top_dragon_yellow.jpg'],
            festival_dur: 96,
            festival_ach: 30000,
            newbg_img: ['monster_header_golddrag.jpg'],
            list_img: ['dragon_list_yellow.jpg'],
            cta_img: ['cta_yellow_dragon.gif']
        },
        'Ancient Red Dragon': {
            duration: 72,
            ach: 100000,
            siege: 0,
            staUse: 5,
            staMax: [5, 10],
            attack_img: ['seamonster_power.gif', 'serpent_10stam_attack.gif'],
            mClass: 'Epic Team',
            mpool: 2,
            festival_img: ['festival_monsters_top_dragon_red.jpg', 'festival_monsters_top_dragon_monster.jpg'],
            festival_dur: 96,
            festival_ach: 50000,
            newbg_img: ['monster_header_ancientreddrag.jpg'],
            list_img: ['dragon_list_red.jpg'],
            cta_img: ['cta_red_dragon.gif']
        },
        'Karn': {
            duration: 120,
            ach: 15000,
            siege: 0,
            mClass: 'Quest Mini-Boss',
            mpool: 4,
            newbg_img: ['monster_header_minotaur.jpg'],
            list_img: ['monster_minotaur_list.jpg']
        },
        'Gildamesh, The Orc King': {
            duration: 72,
            ach: 15000,
            siege: 0,
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_orcking.jpg'],
            festival_dur: 96,
            festival_ach: 30000,
            newbg_img: ['monster_header_gildamesh.jpg'],
            list_img: ['orc_boss_list.jpg'],
            cta_img: ['cta_orc_king.gif']
        },
        'Colossus Of Terra': {
            duration: 72,
            ach: 20000,
            siege: 0,
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_stonegiant.jpg'],
            festival_dur: 96,
            festival_ach: 30000,
            newbg_img: ['monster_header_colossus.jpg'],
            list_img: ['stone_giant_list.jpg'],
            cta_img: ['cta_stone.gif']
        },
        'Sylvanas The Sorceress Queen': {
            duration: 48,
            ach: 50000,
            siege: 1,
            siegeClicks: [11],
            siegeDam: [500000],
            siege_img: ['/graphics/boss_sylvanas_drain_icon.gif'],
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_sylvanus.jpg'],
            festival_dur: 72,
            festival_ach: 30000,
            newbg_img: ['monster_header_sylvanas.jpg', 'monster_header_sylvana.jpg'],
            list_img: ['boss_sylvanus_list.jpg'],
            cta_img: ['cta_sylvanas.gif']
        },
        'Lotus Ravenmoore': {
            duration: 48,
            ach: 500000,
            siege: 0,
            mClass: 'Epic Boss',
            mpool: 1,
            newbg_img: ['monster_header_lotus.jpg'],
            list_img: ['boss_lotus_list.jpg'],
            cta_img: ['cta_lotus.gif']
        },
        'Keira The Dread Knight': {
            duration: 48,
            ach: 30000,
            siege: 0,
            reqAtkButton: 'event_attack1.gif',
            pwrAtkButton: 'event_attack2.gif',
            //defButton    : null,
            mClass: 'Epic Boss',
            mpool: 1,
            newbg_img: ['monster_header_keira.jpg', 'monster_header_keira2.jpg'],
            list_img: ['boss_keira_list.jpg'],
            cta_img: ['cta_keira.gif']
        },
        'Amethyst Sea Serpent': {
            duration: 72,
            defense: true,
            ach: 250000,
            siege: 0,
            fort: true,
            staUse: 10,
            staMax: [10, 20],
            attack_img: ['serpent_10stam_attack.gif', 'serpent_20stam_attack.gif'],
            fortify_img: ['seamonster_fortify.gif'],
            defense_img: 'seamonster_ship_health.jpg',
            mClass: 'Epic Team',
            mpool: 2,
            festival_img: ['festival_monsters_top_seamonster_purple.jpg'],
            festival_dur: 96,
            festival_ach: 30000,
            newbg_img: ['monster_header_amyserpent.jpg'],
            list_img: ['seamonster_list_purple.jpg'],
            cta_img: ['twitter_seamonster_purple_1.jpg']
        },
        'Ancient Sea Serpent': {
            duration: 72,
            defense: true,
            ach: 250000,
            siege: 0,
            fort: true,
            staUse: 10,
            staMax: [10, 20],
            attack_img: ['serpent_10stam_attack.gif', 'serpent_20stam_attack.gif'],
            fortify_img: ['seamonster_fortify.gif'],
            defense_img: 'seamonster_ship_health.jpg',
            mClass: 'Epic Team',
            mpool: 2,
            festival_img: ['festival_monsters_top_seamonster_red.jpg'],
            festival_dur: 96,
            festival_ach: 30000,
            newbg_img: ['monster_header_ancientserpent.jpg'],
            list_img: ['seamonster_list_red.jpg'],
            cta_img: ['twitter_seamonster_red_1.jpg']
        },
        'Emerald Sea Serpent': {
            duration: 72,
            defense: true,
            ach: 250000,
            siege: 0,
            fort: true,
            staUse: 10,
            staMax: [10, 20],
            attack_img: ['serpent_10stam_attack.gif', 'serpent_20stam_attack.gif'],
            fortify_img: ['seamonster_fortify.gif'],
            defense_img: 'seamonster_ship_health.jpg',
            mClass: 'Epic Team',
            mpool: 2,
            festival_img: ['festival_monsters_top_seamonster_green.jpg'],
            festival_dur: 96,
            festival_ach: 30000,
            newbg_img: ['monster_header_emeraldserpent.jpg'],
            list_img: ['seamonster_list_green.jpg'],
            cta_img: ['twitter_seamonster_green_1.jpg']
        },
        'Sapphire Sea Serpent': {
            duration: 72,
            defense: true,
            ach: 250000,
            siege: 0,
            fort: true,
            staUse: 10,
            staMax: [10, 20],
            attack_img: ['serpent_10stam_attack.gif', 'serpent_20stam_attack.gif'],
            fortify_img: ['seamonster_fortify.gif'],
            defense_img: 'seamonster_ship_health.jpg',
            mClass: 'Epic Team',
            mpool: 2,
            festival_img: ['festival_monsters_top_seamonster_blue.jpg'],
            festival_dur: 96,
            festival_ach: 30000,
            newbg_img: ['monster_header_sapphserpent.jpg'],
            list_img: ['seamonster_list_blue.jpg'],
            cta_img: ['twitter_seamonster_blue_1.jpg']
        },
        'The Deathrune Siege': {
            duration: 232,
            ach: 100,
            siege: 2,
            siegeClicks: [80, 100],
            siegeDam: [300, 1500],
            siege_img: ['/graphics/monster_siege_'],
            staUse: 1,
            stage1: {
                duration: 88,
                ach: 50,
                siege: 1,
                siegeClicks: [80],
                siegeDam: [300],
                siege_img: ['/graphics/monster_siege_'],
                staUse: 1
            },
            stage2: {
                duration: 144,
                ach: 100,
                siege: 2,
                siegeClicks: [80, 100],
                siegeDam: [300, 1500],
                siege_img: ['/graphics/monster_siege_'],
                staUse: 1
            },
            cta_img: ['ntwitter_raid1.gif']
        },
        'Mephistopheles': {
            duration: 48,
            ach: 200000,
            siege: 0,
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_mephistopheles.jpg'],
            festival_dur: 89,
            festival_ach: 50000,
            newbg_img: ['monster_header_meph.jpg'],
            list_img: ['boss_mephistopheles_list.jpg'],
            cta_img: ['cta_mephi.gif']
        },
        // http://castleage.wikia.com/wiki/War_of_the_Red_Plains
        'War Of The Red Plains': {
            alpha: true,
            tactics: true,
            duration: 168,
            hp: 350000000,
            ach: 10000,
            siege: 7,
            siegeClicks: [30, 60, 90, 120, 200, 250, 300],
            siegeDam: [13750000, 17500000, 20500000, 23375000, 26500000, 29500000, 34250000],
            siege_img: [
                '/graphics/water_siege_small',
                '/graphics/alpha_bahamut_siege_blizzard_2',
                '/graphics/azriel_siege_inferno_2',
                '/graphics/war_siege_holy_smite_2'],
            fort: true,
            staUse: 5,
            staLvl: [0, 100, 200, 500],
            staMax: [5, 10, 20, 50],
            nrgMax: [10, 20, 40, 100],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 30, 45],
            mClass: 'Epic World',
            mpool: 3,
            newbg_img: ['monster_header_warredplains.jpg'],
            list_img: ['nm_war_list.jpg'],
            cta_img: ['nm_war_twitter_1.gif']
        },
        // http://castleage.wikia.com/wiki/Bahamut,_the_Volcanic_Dragon
        'Bahamut, The Volcanic Dragon': {
            alpha: true,
            duration: 168,
            hp: 130000000,
            ach: 4000000,
            siege: 5,
            siegeClicks: [30, 60, 90, 120, 200],
            siegeDam: [7896000, 9982500, 11979000, 15972000, 19965000],
            siege_img: ['/graphics/water_siege_small'],
            fort: true,
            staUse: 5,
            staLvl: [0, 100, 200, 500],
            staMax: [5, 10, 20, 50],
            nrgMax: [10, 20, 40, 100],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 30, 20],
            mClass: 'Epic World',
            mpool: 3,
            festival_img: ['festival_monsters_top_volcanic_new.jpg'],
            festival_dur: 192,
            festival_ach: 1000000,
            newbg_img: ['monster_header_bahamut.jpg'],
            list_img: ['nm_volcanic_list.jpg'],
            cta_img: ['ntwitter_volcanic1.gif']
        },
        // http://castleage.wikidot.com/alpha-bahamut
        // http://castleage.wikia.com/wiki/Alpha_Bahamut,_The_Volcanic_Dragon
        'Alpha Bahamut, The Volcanic Dragon': {
            alpha: true,
            duration: 168,
            hp: 620000000,
            ach: 8000000,
            siege: 7,
            siegeClicks: [30, 60, 90, 120, 200, 250, 300],
            siegeDam: [22250000, 27500000, 32500000, 37500000, 42500000, 47500000, 55000000],
            siege_img: [
                '/graphics/water_siege_small',
                '/graphics/alpha_bahamut_siege_blizzard_2',
                '/graphics/azriel_siege_inferno_2'],
            fort: true,
            staUse: 5,
            staLvl: [0, 100, 200, 500],
            staMax: [5, 10, 20, 50],
            nrgMax: [10, 20, 40, 100],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 30, 60],
            mClass: 'Epic World',
            mpool: 3,
            festival_img: ['festival_monsters_top_alpha_volcanic_new.jpg'],
            festival_dur: 192,
            festival_ach: 2500000,
            newbg_img: ['monster_header_alphabahamut.jpg'],
            list_img: ['nm_volcanic_list_2.jpg'],
            cta_img: ['ntwitter_volcanic5.gif']
        },
        // http://castleage.wikia.com/wiki/Azriel,_the_Angel_of_Wrath
        'Azriel, The Angel Of Wrath': {
            alpha: true,
            duration: 168,
            hp: 600000000,
            ach: 8000000,
            siege: 7,
            siegeClicks: [30, 60, 90, 120, 200, 250, 300],
            siegeDam: [22250000, 27500000, 32500000, 37500000, 42500000, 47500000, 55000000],
            siege_img: [
                '/graphics/water_siege_small',
                '/graphics/alpha_bahamut_siege_blizzard_2',
                '/graphics/azriel_siege_inferno_2'],
            fort: true,
            staUse: 5,
            staLvl: [0, 100, 200, 500],
            staMax: [5, 10, 20, 50],
            nrgMax: [10, 20, 40, 100],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 30, 45],
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_boss_azriel.jpg'],
            festival_dur: 192,
            festival_ach: 4000000,
            newbg_img: ['monster_header_azriel.jpg'],
            list_img: ['nm_azriel_list.jpg'],
            cta_img: ['nm_azriel_twitter_1.gif']
        },
        'Alpha Mephistopheles': {
            alpha: true,
            duration: 168,
            hp: 600000000,
            ach: 12000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [19050000, 22860000, 26670000, 30480000, 34290000, 38100000, 45720000, 49530000, 53340000, 60960000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/death_siege_small',
                '/graphics/skaar_siege_small'],
            fort: true,
            staUse: 5,
            staLvl: [0, 100, 200, 500],
            staMax: [5, 10, 20, 50],
            nrgMax: [10, 20, 40, 100],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 30, 45],
            mClass: 'Epic Boss',
            mpool: 3,
            festival_img: ['festival_monsters_top_alpha_mephistopheles.jpg'],
            festival_dur: 192,
            festival_ach: 1000000,
            festival_mpool: 1,
            newbg_img: ['monster_header_alphameph.jpg'],
            list_img: ['nm_alpha_mephistopheles_list.jpg'],
            cta_img: ['nm_alpha_mephistopheles_twitter_1.gif']
        },
        'Gehenna, The Fire Elemental': {
            alpha: true,
            duration: 168,
            hp: 350000000,
            ach: 1000000,
            siege: 7,
            siegeClicks: [30, 60, 90, 120, 200, 250, 300],
            siegeDam: [14750000, 18500000, 21000000, 24250000, 27000000, 30000000, 35000000],
            siege_img: [
                '/graphics/water_siege_small',
                '/graphics/alpha_bahamut_siege_blizzard_2',
                '/graphics/azriel_siege_inferno_2',
                '/graphics/war_siege_holy_smite_2'],
            fort: true,
            staUse: 5,
            staLvl: [0, 100, 200, 500],
            staMax: [5, 10, 20, 50],
            nrgMax: [10, 20, 40, 100],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 30, 45],
            mClass: 'Epic World',
            mpool: 3,
            festival_img: ['festival_monsters_top_fire_element.jpg'],
            festival_dur: 96,
            festival_ach: 3500000,
            newbg_img: ['monster_header_gehenna.jpg'],
            list_img: ['nm_gehenna_list.jpg'],
            cta_img: ['nm_gehenna_twitter_1.gif']
        },
        "Aurelius, Lion's Rebellion": {
            alpha: true,
            tactics: true,
            duration: 168,
            hp: 350000000,
            ach: 1000,
            siege: 7,
            siegeClicks: [30, 60, 90, 120, 200, 250, 300],
            siegeDam: [15250000, 19000000, 21500000, 24750000, 27500000, 30500000, 35500000],
            siege_img: [
                '/graphics/water_siege_small',
                '/graphics/alpha_bahamut_siege_blizzard_2',
                '/graphics/azriel_siege_inferno_2',
                '/graphics/war_siege_holy_smite_2'],
            fort: true,
            staUse: 5,
            staLvl: [0, 100, 200, 500],
            staMax: [5, 10, 20, 50],
            nrgMax: [10, 20, 40, 100],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 30, 45],
            mClass: 'Epic Boss',
            mpool: 1,
            newbg_img: ['monster_header_lionrebellion.jpg'],
            list_img: ['nm_aurelius_list.jpg'],
            cta_img: ['twitter_aurelius.gif']
        },
        "Corvintheus": {
            alpha: true,
            duration: 168,
            hp: 640000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [16000000, 19200000, 22400000, 25600000, 28800000, 32000000, 38400000, 41600000, 44800000, 51200000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 30, 45],
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_corvintheus.jpg'],
            festival_dur: 192,
            festival_ach: 2500000,
            newbg_img: ['monster_header_corvintheus.jpg'],
            list_img: ['corv_list.jpg'],
            cta_img: ['cta_corv1.gif']
        },
        'Valhalla, The Air Elemental': {
            alpha: true,
            duration: 168,
            hp: 650000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [16250000, 19500000, 22750000, 26000000, 29250000, 32500000, 39000000, 42250000, 45500000, 52000000],
            siege_img: [
                '/graphics/water_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/alpha_bahamut_siege_blizzard_2',
                '/graphics/azriel_siege_inferno_2',
                '/graphics/war_siege_holy_smite_2'],
            fort: true,
            staUse: 10,
            staLvl: [0, 50, 100, 200],
            staMax: [10, 20, 50, 100],
            nrgMax: [20, 40, 100, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 30, 45],
            mClass: 'Epic World',
            mpool: 3,
            festival_img: ['festival_monsters_top_air_element.jpg'],
            festival_dur: 192,
            festival_ach: 2500000,
            newbg_img: ['monster_header_valhalla.jpg'],
            list_img: ['monster_valhalla_list.jpg'],
            cta_img: ['cta_valhalla.gif']
        },
        'Jahanna, Priestess Of Aurora': {
            alpha: true,
            duration: 168,
            hp: 650000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [16000000, 19200000, 22400000, 25600000, 28800000, 32000000, 38400000, 41600000, 44800000, 51200000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/death_siege_small',
                '/graphics/war_siege_holy_smite_2'],
            fort: true,
            staUse: 10,
            staLvl: [0, 50, 100, 200],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_jahanna.jpg'],
            festival_dur: 192,
            festival_ach: 2500000,
            newbg_img: ['monster_header_jahanna.jpg'],
            list_img: ['boss_jahanna_list.jpg'],
            cta_img: ['cta_jahanna.gif']
        },
        "Agamemnon The Overseer": {
            alpha: true,
            duration: 168,
            hp: 640000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [16000000, 19200000, 22400000, 25600000, 28800000, 32000000, 38400000, 41600000, 44800000, 51200000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100],
            nrgMax: [20, 40, 100, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_agamemnon.jpg'],
            festival_dur: 192,
            festival_ach: 10000000,
            cta_img: ['cta_agamemnon.gif']
        },
        "Aurora": {
            alpha: true,
            duration: 168,
            hp: 640000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [16000000, 19200000, 22400000, 25600000, 28800000, 32000000, 38400000, 41600000, 44800000, 51200000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 5,
            staLvl: [0, 100, 200, 500],
            staMax: [5, 10, 20, 50],
            nrgMax: [10, 20, 40, 100],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_aurora.jpg'],
            festival_dur: 192,
            festival_ach: 2500000,
            newbg_img: ['monster_header_aurora.jpg'],
            list_img: ['boss_aurora_list.jpg'],
            cta_img: ['cta_aurora.gif']
        },
        "Ambrosia": {
            alpha: true,
            duration: 168,
            hp: 640000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [16000000, 19200000, 22400000, 25600000, 28800000, 32000000, 38400000, 41600000, 44800000, 51200000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 5,
            staLvl: [0, 100, 200, 500],
            staMax: [5, 10, 20, 50],
            nrgMax: [10, 20, 40, 100],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_ambrosia.jpg'],
            festival_dur: 192,
            festival_ach: 2500000,
            //newbg_img: ['boss_ambrosia_header.jpg'],
            newbg_img: ['boss_header_ambrosia.jpg'],
            list_img: ['boss_ambrosia_list.jpg'],
            cta_img: ['cta_ambrosia.gif']
        },
        "Kromash, The Storm Giant": {
            alpha: true,
            duration: 168,
            hp: 500000000,
            ach: 1000000,
            siege: 8,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200],
            siegeDam: [10000000, 14000000, 18000000, 22000000, 26000000, 30000000, 38000000, 42000000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_storm_giant.jpg'],
            festival_dur: 192,
            festival_ach: 2500000,
            newbg_img: ['monster_header_kromash.jpg'],
            list_img: ['monster_kromash_list.jpg'],
            cta_img: ['cta_kromash.gif']
        },
        "Glacius, The Frost Giant": {
            alpha: true,
            duration: 168,
            hp: 400000000,
            ach: 1000000,
            siege: 8,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200],
            siegeDam: [10000000, 14000000, 18000000, 22000000, 26000000, 30000000, 38000000, 42000000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500, 1000],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [25, 30, 35, 50],
            mClass: 'Epic Boss',
            mpool: 3,
            festival_img: ['festival_monsters_top_frost_giant.jpg'],
            festival_dur: 120,
            festival_ach: 1000000,
            newbg_img: ['monster_header_glacius.jpg'],
            list_img: ['monster_glacius_list.jpg'],
            cta_img: ['cta_glacius.gif']
        },
        "Shardros, The Mountain Giant": {
            alpha: true,
            duration: 168,
            hp: 175000000,
            ach: 1000000,
            siege: 5,
            siegeClicks: [30, 60, 90, 120, 200],
            siegeDam: [9000000, 12600000, 18000000, 23400000, 27000000, 90000000],
            siege_img: [
                '/graphics/water_siege_small',
                '/graphics/alpha_bahamut_siege_blizzard'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_mountain_giant.jpg'],
            festival_dur: 120,
            festival_ach: 1000000,
            newbg_img: ['monster_header_shardros.jpg'],
            list_img: ['monster_shardros_list.jpg'],
            cta_img: ['cta_shardros.gif']
        },
        "Magmos, The Lava Giant": {
            alpha: true,
            duration: 168,
            hp: 500000000,
            ach: 1000000,
            siege: 8,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200],
            siegeDam: [10000000, 14000000, 18000000, 22000000, 26000000, 30000000, 38000000, 42000000],
            siege_img: ['/graphics/earth_siege_small', '/graphics/castle_siege_small', '/graphics/skaar_siege_small', '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100],
            nrgMax: [20, 40, 100, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_lava_giant.jpg'],
            festival_dur: 192,
            festival_ach: 2500000,
            newbg_img: ['monster_header_magmos.jpg'],
            list_img: ['monster_magmos_list.jpg'],
            cta_img: ['cta_magmos.gif']
        },
        "Typhonus, The Chimera": {
            alpha: true,
            duration: 168,
            hp: 500000000,
            ach: 1000000,
            siege: 8,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200],
            siegeDam: [10000000, 14000000, 18000000, 22000000, 26000000, 30000000, 38000000, 42000000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100],
            nrgMax: [20, 40, 100, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_chimera.jpg'],
            festival_dur: 192,
            festival_ach: 2500000,
            newbg_img: ['monster_header_chimera.jpg'],
            list_img: ['monster_chimera_list.jpg'],
            cta_img: ['cta_typhonus.gif']
        },
        "Malekus": {
            alpha: true,
            duration: 168,
            hp: 640000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [16000000, 19200000, 22300000, 25000000, 28000000, 37000000, 40000000, 45000000, 45500000, 52000000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/earth_siege_small2',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_malekus.jpg'],
            festival_dur: 192,
            festival_ach: 2500000,
            newbg_img: ['boss_header_malekus.jpg'],
            list_img: ['boss_malekus_list.jpg'],
            cta_img: ['cta_btn_new.gif']
        },
        "Thanatos": {
            alpha: true,
            duration: 168,
            hp: 350000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [6400000, 7680000, 8920000, 10000000, 11200000, 14800000, 16000000, 18000000, 18200000, 18200000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50],
            nrgMax: [20, 40, 100],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic World',
            mpool: 3,
            newbg_img: ['monster_thanatos2_header.jpg'],
            list_img: ['monster_thanatos2_list_ca.jpg'],
            cta_img: ['cta_thanatos2.gif']
        },
        "Vermilion": {
            alpha: true,
            duration: 168,
            hp: 350000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [6400000, 7680000, 8920000, 10000000, 11200000, 14800000, 16000000, 18000000, 18200000, 18200000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic World',
            mpool: 3,
            newbg_img: ['monster_vermilion_header.jpg'],
            list_img: ['monster_vermilion_list.jpg'],
            cta_img: ['cta_vermilion.gif']
        },
        "Alexandra the Unbreakable": {
            alpha: true,
            duration: 168,
            hp: 640000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [16000000, 19200000, 22400000, 25600000, 28800000, 32000000, 38400000, 41600000, 44800000, 51200000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100],
            nrgMax: [20, 40, 100, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic Boss',
            mpool: 1,
            festival_img: ['festival_monsters_top_alexandra.jpg'],
            festival_dur: 192,
            festival_ach: 10000000,
            cta_img: ['cta_alexandra.gif']
        },        
    "Alpha Kraken": {
                alpha: true,
                duration: 168,
                hp: 650000000,
                ach: 1000000,
                siege: 10,
                siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
                siegeDam: [16000000, 19200000, 22300000, 25000000, 28000000, 37000000, 40000000, 4500000, 45500000, 52000000],
                siege_img: [
                    '/graphics/earth_siege_small',
                    '/graphics/castle_siege_small',
                    '/graphics/skaar_siege_small',
                    '/graphics/death_siege_small'],
                fort: true,
                staUse: 10,
                staLvl: [0, 100, 200, 500],
                staMax: [10, 20, 50, 100, 200],
                nrgMax: [20, 40, 100, 200,200],
                defense_img: 'nm_green.jpg',
                levels: [1, 50, 100, 150],
                join: [30, 30, 35, 50],
                mClass: 'Epic World',
                mpool: 3,
                newbg_img: ['monster_alpha_kraken_header.jpg'],
                list_img: ['monster_kraken2_list.jpg'],
                cta_img: ['cta_kraken.gif']
            },
            "Kraken": {
                alpha: true,
                duration: 168,
                hp: 300000000,
                ach: 1000000,
                siege: 7,
                siegeClicks: [30, 60, 90, 120, 200, 250, 300],
                siegeDam: [13750000, 17500000, 20500000, 23375000, 28000000, 37000000, 40000000, 4500000, 45500000, 52000000],
                siege_img: [
                    '/graphics/water_siege_small',
                    '/graphics/earth_siege_small',
                    '/graphics/castle_siege_small',
                    '/graphics/skaar_siege_small',
                    '/graphics/death_siege_small'],
                fort: true,
                staUse: 10,
                staLvl: [0, 100, 200, 500],
                staMax: [10, 20, 50, 100],
                nrgMax: [20, 40, 100, 200],
                defense_img: 'nm_green.jpg',
                levels: [1, 50, 100, 150],
                join: [30, 30, 35, 50],
                mClass: 'Epic World',
                mpool: 3,
                newbg_img: ['monster_kraken_header.jpg'],
                list_img: ['monster_kraken_list.jpg'],
                cta_img: ['cta_kraken.gif']
            },
        "Fenix": {
            alpha: true,
            duration: 168,
            hp: 612000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200],
            siegeDam: [16000000, 19000000, 22300000, 29000000, 33000000, 37000000, 40000000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic Boss',
            mpool: 1,
            newbg_img: ['boss_fenix_header.jpg'],
            list_img: ['boss_fenix_list.jpg'],
            cta_img: ['cta_fenix.gif'],
            bodyparts: 3,
            partOrder: [3, 2, 1]
        },
        "Azeron": {
            alpha: true,
            duration: 168,
            hp: 640000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [16000000, 19200000, 22300000, 25000000, 28000000, 37000000, 40000000, 4500000, 45500000, 52000000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100],
            nrgMax: [20, 40, 100, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic Boss',
            mpool: 1,
            newbg_img: ['boss_azeron_header.jpg'],
            list_img: ['boss_azeron_list.jpg'],
            cta_img: ['cta_azeron.gif']
        },
        "Kessaran": {
            alpha: true,
            duration: 168,
            hp: 750000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200],
            siegeDam: [16000000, 19000000, 22300000, 29000000, 33000000, 37000000, 40000000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic World',
            mpool: 101,
            newbg_img: ['monster_header_kessaran.jpg'],
            list_img: ['monster_kessaran_list.jpg'],
            cta_img: ['cta_kessaran.gif'],
            bodyparts: 3,
            partOrder: [3, 2, 1]
        },
        "Urmek": {
            alpha: true,
            duration: 168,
            hp: 775000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [9000000, 11000000, 1500000, 19000000, 23000000, 27000000, 31000000, 35000000, 39000000, 4400000],
            siege_img: [
                '/graphics/earth_siege_small1',
                '/graphics/castle_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 60],
            mClass: 'Epic Boss',
            mpool: 101,
            newbg_img: ['monster_header_urmek.jpg'],
            list_img: ['monster_urmek_list.jpg'],
            cta_img: ['cta_urmek.gif'],
            bodyparts: 4,
            partOrder: [4, 3, 2, 1]
        },
        "Abomination": {
            alpha: true,
            duration: 168,
            hp: 800000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [9000000, 11000000, 1500000, 19000000, 23000000, 27000000, 31000000, 35000000, 39000000, 4400000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 60],
            mClass: 'Epic Boss',
            mpool: 3,
            newbg_img: ['monster_abomination_header.jpg'],
            list_img: ['monster_abomination_list.jpg'],
            cta_img: ['cta_abomination.gif'],
            bodyparts: 5,
            partOrder: [5, 4, 3, 2, 1]
        },
        "Poseidon": {
            alpha: true,
            duration: 168,
            hp: 650000000,
            ach: 5200000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [9000000, 11000000, 15000000, 19000000, 23000000, 27000000, 31000000, 35000000, 39000000, 44000000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 50],
            mClass: 'Epic Boss',
            mpool: 1,
            newbg_img: ['monster_header_poseidon.jpg'],
            list_img: ['monster_poseidon_list.jpg'],
            cta_img: ['cta_poseidon.gif'],
            bodyparts: 3,
            partOrder: [3, 2, 1]
        },
        "Vorak": {
            alpha: true,
            duration: 168,
            hp: 650000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 70, 100, 150, 200, 250, 300],
            siegeDam: [9000000, 11000000, 15000000, 19000000, 23000000, 27000000, 31000000, 35000000, 39000000, 44000000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 60],
            mClass: 'Epic Boss',
            mpool: 1,
            newbg_img: ['monster_header_vorak.jpg'],
            list_img: ['monster_header_vorak.jpg'],
            cta_img: ['cta_vorak.gif'],
            bodyparts: 4,
            partOrder: [4, 3, 2, 1]
        },
        "BAAL Stealer of Souls": {
            alpha: true,
            duration: 168,
            hp: 830000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [10000000, 12000000, 16000000, 20000000, 24000000, 28000000, 32000000, 36000000, 40000000, 44000000],
            siege_img: ['/graphics/earth_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 60],
            mClass: 'Epic Boss',
            mpool: 101,
            newbg_img: ['monster_baal_title.jpg'],
            list_img: ['monster_baal_list.jpg'],
            cta_img: ['cta_baal.gif'],
            bodyparts: 5,
            partOrder: [5, 4, 3, 2, 1]
        },
        "Lord Of Darkness": {
            alpha: true,
            duration: 168,
            hp: 850000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [10000000, 12000000, 16000000, 20000000, 24000000, 28000000, 32000000, 36000000, 40000000, 44000000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 70],
            mClass: 'Epic World',
            mpool: 101,
            newbg_img: ['monster_darkness_header.jpg'],
            list_img: ['monster_darkness_list.jpg'],
            cta_img: ['cta_darkness.gif'],
            bodyparts: 5,
            partOrder: [5, 4, 3, 2, 1]
        },
        "Svarog": {
            alpha: true,
            duration: 168,
            hp: 870000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [10000000, 12000000, 16000000, 20000000, 24000000, 28000000, 32000000, 36000000, 40000000, 44000000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 70],
            mClass: 'Epic World',
            mpool: 101,
            newbg_img: ['monster_magmapede_title.jpg'],
            list_img: ['monster_magmapede_list.jpg'],
            cta_img: ['cta_magmapede.gif'],
            bodyparts: 5,
            partOrder: [5, 4, 3, 2, 1]
        },
        // http://castleage.wikia.com/wiki/Alperon,_the_Corrupted
        "Alperon": {
            alpha: true,
            duration: 168,
            hp: 1010000000,
            ach: 1000000,
            siege: 10,
            siegeClicks: [15, 30, 45, 60, 75, 100, 150, 200, 250, 300],
            siegeDam: [20000000, 23000000, 26000000, 29000000, 32000000, 35000000, 38000000, 43000000, 45000000, 48000000],
            siege_img: [
                '/graphics/earth_siege_small',
                '/graphics/castle_siege_small',
                '/graphics/skaar_siege_small',
                '/graphics/death_siege_small'],
            fort: true,
            staUse: 10,
            staLvl: [0, 100, 200, 500],
            staMax: [10, 20, 50, 100, 200],
            nrgMax: [20, 40, 100, 200, 200],
            defense_img: 'nm_green.jpg',
            levels: [1, 50, 100, 150],
            join: [30, 30, 35, 75],
            mClass: 'Epic World',
            mpool: 101,
            newbg_img: ['monster_alperon_title.jpg'],
            list_img: ['monster_alperon_list.jpg'],
            cta_img: ['cta_icon2.gif'],
            bodyparts: 5,
            partOrder: [5, 4, 3, 2, 1]
        }
    };

    monster.list = function() {
        try {
            var i = '',
                list = [];

            for (i in monster.info) {
                if (monster.info.hasOwnProperty(i)) {
                    list.push(i);
                }
            }

            return list.sort();
        } catch (err) {
            con.error("ERROR in monster.list: " + err);
            return undefined;
        }
    };

    monster.getFestName = function(img) {
        return monster.which(img, "festival_img");
    };

    monster.getNewName = function(img) {
        return monster.which(img, "newbg_img");
    };

    monster.getListName = function(img) {
        return monster.which(img, "list_img");
    };

    monster.getCtaName = function(img) {
        return monster.which(img, "cta_img");
    };

    monster.which = function(img, entity) {
        try {
            if (!$u.hasContent(img) || !$u.isString(img)) {
                con.warn("img", img);
                throw "Invalid identifying img!";
            }

            if (!$u.hasContent(entity) || !$u.isString(entity)) {
                con.warn("entity", entity);
                throw "Invalid entity name!";
            }

            var i = '',
                k = 0,
                r = {},
                name = '';

            // current thinking is that continue should not be used as it can cause reader confusion
            // therefore when linting, it throws a warning
            /*jslint continue: true */
            for (i in monster.info) {
                if (monster.info.hasOwnProperty(i)) {
                    if ($u.hasContent(name)) {
                        break;
                    }

                    r = monster.info[i];
                    if (!$u.hasContent(r) || !$u.hasContent(r[entity]) || !$j.isArray(r[entity])) {
                        continue;
                    }

                    for (k = 0; k < r[entity].length; k += 1) {
                        if (img === r[entity][k]) {
                            name = i;
                            break;
                        }
                    }
                }
            }
            /*jslint continue: true */

            return name;
        } catch (err) {
            con.error("ERROR in monster.which: " + err);
            return undefined;
        }
    };

    monster.getInfo = function(record) {
        try {
            if (!$u.hasContent(record) || !$j.isPlainObject(record)) {
                throw "Not passed a record";
            }

            var monsterInfo = monster.info[record.monster];
            return $u.hasContent(record.type) ? (record.type === "Raid II" ? monsterInfo.stage2 : monsterInfo.stage1) : monsterInfo;
        } catch (err) {
            con.error("ERROR in monster.getInfo: " + err);
            return undefined;
        }
    };

    monster.load = function() {
        try {
            monster.records = gm.getItem('monster.records', 'default');
            if (monster.records === 'default' || !$j.isArray(monster.records)) {
                monster.records = gm.setItem('monster.records', []);
            }

            session.setItem("MonsterDashUpdate", true);
            con.log(5, "monster.load", monster.records);
            return true;
        } catch (err) {
            con.error("ERROR in monster.load: " + err);
            return false;
        }
    };

    monster.save = function(src) {
        try {
            if (caap.domain.which === 3) {
                caap.messaging.setItem('monster.records', monster.records);
            } else {
                gm.setItem('monster.records', monster.records);
                con.log(5, "monster.save", monster.records);
                if (caap.domain.which === 0 && caap.messaging.connected.hasIndexOf("caapif") && src !== "caapif") {
                    con.log(2, "monster.save send");
                    caap.messaging.setItem('monster.records', monster.records);
                }
            }

            if (caap.domain.which !== 0) {
                session.setItem("MonsterDashUpdate", true);
            }

            return true;
        } catch (err) {
            con.error("ERROR in monster.save: " + err);
            return false;
        }
    };

    monster.clean = function() {
        try {
            var it = 0,
                list = [];

            for (it = 0; it < monster.records.length; it += 1) {
                if (!monster.records[it].joined) {
                    list.push(monster.records[it].md5);
                }
            }

            for (it = 0; it < list.length; it += 1) {
                monster.deleteItem(list[it]);
            }

            return true;
        } catch (err) {
            con.error("ERROR in monster.clean: " + err);
            return false;
        }
    };

    monster.parseCondition = function(type, conditions) {
        try {
            if (!$u.hasContent(type) || !$u.hasContent(conditions) || !conditions.toLowerCase().hasIndexOf(':' + type)) {
                return false;
            }

            var str = $u.setContent(conditions.substring(conditions.indexOf(':' + type) + type.length + 1).replace(new RegExp(":.+"), ''), ''),
                value = str.numberOnly(),
                first = false,
                second = false;

            if (str && (/k$/i.test(str) || /m$/i.test(str))) {
                first = /\d+k/i.test(str);
                second = /\d+m/i.test(str);
                value = value * 1000 * (first + second * 1000);
            }

            return value;
        } catch (err) {
            con.error("ERROR in monster.parseCondition: " + err);
            return false;
        }
    };

    monster.type = function(name) {
        try {
            var words = [],
                count = 0;

            if (!$u.isString(name)) {
                con.warn("name", name);
                throw "Invalid identifying name!";
            }

            if (name === '') {
                return '';
            }

            words = name.split(" ");
            con.log(3, "Words", words);
            count = words.length - 1;
            if (count >= 4) {
                if (words[count - 4] === 'Alpha' && words[count - 1] === 'Volcanic' && words[count] === 'Dragon') {
                    return words[count - 4] + ' ' + words[count - 1] + ' ' + words[count];
                }

                if (words[count - 2] === 'Priestess' && words[count - 1] === 'of' && words[count] === 'Aurora') {
                    return words[count - 2] + ' ' + words[count - 1] + ' ' + words[count];
                }
            }

            if (words[count] === 'Elemental' || words[count] === 'Dragon' || (words[count - 1] === 'Alpha' && words[count] === 'Mephistopheles') ||
                (words[count - 1] === "Lion's" && words[count] === 'Rebellion') || (words[count - 1] === 'Fire' && words[count] === 'Elemental')) {
                return words[count - 1] + ' ' + words[count];
            }

            return words[count];
        } catch (err) {
            con.error("ERROR in monster.type: " + err);
            return false;
        }
    };

    monster.getItem = function(md5) {
        try {
            var it = 0,
                len = 0,
                success = false,
                newRecord = {},
                record = {};

            if (!$u.isString(md5)) {
                con.warn("md5", md5);
                throw "Invalid identifying md5!";
            }

            if ($u.hasContent(md5)) {
                for (it = 0, len = monster.records.length; it < len; it += 1) {
                    if (monster.records[it].md5 === md5) {
                        success = true;
                        break;
                    }
                }
            }

            if (success) {
                record = monster.records[it];
                con.log(3, "Got monster record", md5, record);
            } else {
                newRecord = new monster.record();
                newRecord.data.md5 = md5;
                record = newRecord.data;
                con.log(3, "New monster record", md5, record);
            }

            return record;
        } catch (err) {
            con.error("ERROR in monster.getItem: " + err);
            return undefined;
        }
    };

    monster.setItem = function(record) {
        try {
            if (!$u.hasContent(record) || !$j.isPlainObject(record)) {
                throw "Not passed a record";
            }

            if (!$u.isString(record.md5) || !$u.hasContent(record.md5)) {
                con.warn("md5", record.md5);
                throw "Invalid identifying md5!";
            }

            var it = 0,
                len = 0,
                success = false;

            if (config.getItem('enableMonsterFinder', false) && !record.select) {
                feed.checked(record);
            }

            record.select = false;
            if (record.save) {
                for (it = 0, len = monster.records.length; it < len; it += 1) {
                    if (monster.records[it].md5 === record.md5) {
                        success = true;
                        break;
                    }
                }

                if (success) {
                    monster.records[it] = record;
                    con.log(3, "Updated monster record", record, monster.records);
                } else {
                    monster.records.push(record);
                    con.log(3, "Added monster record", record, monster.records);
                }

                monster.save();
            }

            return record;
        } catch (err) {
            con.error("ERROR in monster.setItem: " + err);
            return undefined;
        }
    };

    monster.deleteItem = function(md5) {
        try {
            var it = 0,
                len = 0,
                success = false;

            if (!$u.isString(md5) || !$u.hasContent(md5)) {
                con.warn("md5", md5);
                throw "Invalid identifying md5!";
            }

            for (it = 0, len = monster.records.length; it < len; it += 1) {
                if (monster.records[it].md5 === md5) {
                    success = true;
                    break;
                }
            }

            if (success) {
                monster.records.splice(it, 1);
                monster.save();
                con.log(3, "Deleted monster record", md5, monster.records);
            } else {
                con.warn("Unable to delete monster record", md5, monster.records);
            }

            return success;
        } catch (err) {
            con.error("ERROR in monster.deleteItem: " + err);
            return false;
        }
    };

    monster.clear = function() {
        try {
            monster.records = [];
            monster.save();
            session.setItem("MonsterDashUpdate", true);
            return true;
        } catch (err) {
            con.error("ERROR in monster.clear: " + err);
            return false;
        }
    };

    monster.t2kCalc = function(record) {
        try {
            var boss = monster.getInfo(record),
                siegeStage = record.phase - 1,
                timeLeft = record.time[0] + (record.time[1] * 0.0166),
                duration = record.page === 'festival_battle_monster' ? (boss ? boss.festival_dur : 192) : (boss ? boss.duration : 192),
                timeUsed = duration - timeLeft,
                T2K = 0,
                damageDone = 0,
                hpLeft = 0,
                totalSiegeDamage = 0,
                totalSiegeClicks = 0,
                attackDamPerHour = 0,
                clicksPerHour = 0,
                clicksToNextSiege = 0,
                nextSiegeAttackPlusSiegeDamage = 0,
                s = 0,
                len = 0,
                siegeImpacts = 0;

            if (!boss.siege || !boss.hp) {
                T2K = ((record.life * timeUsed) / (100 - record.life)).dp(2);
                con.log(3, 'T2K: ', $u.minutes2hours(T2K));
                return T2K;
            }

            damageDone = (100 - record.life) / 100 * boss.hp;
            hpLeft = boss.hp - damageDone;
            for (s = 0, len = boss.siegeClicks.length; s < len; s += 1) {
                con.log(5, 's ', s, ' T2K ', T2K, ' hpLeft ', hpLeft);
                if (s < siegeStage || record.miss === 0) {
                    totalSiegeDamage += boss.siegeDam[s];
                    totalSiegeClicks += boss.siegeClicks[s];
                } else if (s === siegeStage) {
                    attackDamPerHour = (damageDone - totalSiegeDamage) / timeUsed;
                    clicksPerHour = (totalSiegeClicks + boss.siegeClicks[s] - record.miss) / timeUsed;
                    con.log(5, 'Attack Damage Per Hour: ', attackDamPerHour);
                    con.log(5, 'Damage Done: ', damageDone);
                    con.log(5, 'Total Siege Damage: ', totalSiegeDamage);
                    con.log(5, 'Time Used: ', timeUsed);
                    con.log(5, 'Clicks Per Hour: ', clicksPerHour);
                } else if (s >= siegeStage) {
                    clicksToNextSiege = (s === siegeStage) ? record.miss : boss.siegeClicks[s];
                    nextSiegeAttackPlusSiegeDamage = boss.siegeDam[s] + clicksToNextSiege / clicksPerHour * attackDamPerHour;
                    if (hpLeft <= nextSiegeAttackPlusSiegeDamage || record.miss === 0) {
                        T2K += hpLeft / attackDamPerHour;
                        break;
                    }

                    T2K += clicksToNextSiege / clicksPerHour;
                    hpLeft -= nextSiegeAttackPlusSiegeDamage;
                }
            }

            siegeImpacts = (record.life / (100 - record.life) * timeLeft).dp(2);
            T2K = T2K.dp(2);
            con.log(3, 'T2K based on siege: ', $u.minutes2hours(T2K));
            con.log(3, 'T2K estimate without calculating siege impacts: ', $u.minutes2hours(siegeImpacts));
            return T2K > 0 ? T2K : siegeImpacts;
        } catch (err) {
            con.error("ERROR in monster.t2kCalc: " + err);
            return 0;
        }
    };

    monster.characterClass = {
        'Warrior': ['Strengthen', 'Heal'],
        'Rogue': ['Cripple'],
        'Mage': ['Deflect'],
        'Cleric': ['Heal'],
        'Warlock': ['Heal', 'Deflect'],
        'Ranger': ['Strengthen', 'Heal', 'Cripple']
    };

    monster.flagReview = function() {
        try {
            schedule.setItem("monsterReview", 0);
            //state.setItem('monsterReviewCounter', config.getItem("festivalTower", false) ? -4 : -3);
            state.setItem('monsterReviewCounter', - 10); // set this high so we have room for more monsters
            return true;
        } catch (err) {
            con.error("ERROR in monster.flagReview: " + err);
            return false;
        }
    };

    monster.flagFullReview = function() {
        try {
            monster.clear();
            monster.flagReview();
            schedule.setItem('NotargetFrombattle_monster', 0);
            session.setItem('ReleaseControl', true);
            caap.updateDashboard(true);
            if (monster.records.length == 0) {
                localStorage.AFrecentAction = false;
            } else {
                localStorage.AFrecentAction = true;
            }

            return true;
        } catch (err) {
            con.error("ERROR in monster.flagFullReview: " + err);
            return false;
        }
    };

    monster.energyTarget = function() {
        return JSON.copy({
            'md5': '',
            'name': '',
            'type': ''
        });
    };

    monster.select = function(force) {
        try {
            if (!(force || caap.oneMinuteUpdate('selectMonster')) || caap.stats.level < 7) {
                return false;
            }

            con.log(3, 'Selecting monster');
            var monsterList = {
                'battle_monster': [],
                'raid': [],
                'any': []
            },
            it = 0,
                len = 0,
                len1 = 0,
                len2 = 0,
                len3 = 0,
                s = 0,
                selectTypes = [],
                maxToFortify = 0,
                nodeNum = 0,
                firstOverAch = '',
                firstUnderMax = '',
                firstFortOverAch = '',
                firstFortUnderMax = '',
                firstStunOverAch = '',
                firstStunUnderMax = '',
                firstStrengthOverAch = '',
                firstStrengthUnderMax = '',
                strengthTarget = '',
                fortifyTarget = '',
                stunTarget = '',
                energyTarget = monster.energyTarget(),
                target = {
                    'battle_monster': '',
                    'raid': '',
                    'fortify': monster.energyTarget()
                },
                monsterMD5 = '',
                monsterObj = {},
                monsterConditions = '',
                //monstType             = '',
                monsterInfo = {},
                p = 0,
                m = 0,
                attackOrderList = [],
                theGeneral = config.getItem('MonsterGeneral', 'Use Current');

            theGeneral = theGeneral === "Under Level" ? (config.getItem('ReverseLevelUpGenerals') ? general.GetLevelUpNames().reverse().pop() : general.GetLevelUpNames().pop()) : theGeneral;
            // First we forget everything about who we already picked.
            //state.setItem('targetFrombattle_monster', '');
            //state.setItem('targetFromfortify', energyTarget);
            //state.setItem('targetFromraid', '');

            // Next we get our monster objects from the reposoitory and break them into separarte lists
            // for monster or raid.  If we are serializing then we make one list only.

            // current thinking is that continue should not be used as it can cause reader confusion
            // therefore when linting, it throws a warning
            /*jslint continue: true */
            for (it = 0, len = monster.records.length; it < len; it += 1) {
                if (!monster.records[it].joined) {
                    continue;
                }

                monsterInfo = monster.getInfo(monster.records[it]);
                if (monsterInfo && monsterInfo.alpha) {
                    if (monster.records[it].damage !== -1 && monster.records[it].color !== 'grey' && schedule.since(monster.records[it].stunTime, 0)) {
                        con.log(2, "Review monster due to class timer", monster.records[it].name);
                        monster.records[it].review = -1;
                        monster.flagReview();
                    }
                }
                monster.records[it].conditions = 'none';
                if (config.getItem('SerializeRaidsAndMonsters', false)) {
                    monsterList.any.push(monster.records[it].md5);
                } else if ((monster.records[it].page === 'raid') || (monster.records[it].page.replace('festival_battle_monster', 'battle_monster').replace('guildv2_battle_monster', 'battle_monster').replace('guildv2_monster_list', 'battle_monster') === 'battle_monster')) {
                    monsterList[monster.records[it].page.replace('festival_battle_monster', 'battle_monster').replace('guildv2_battle_monster', 'battle_monster').replace('guildv2_monster_list', 'battle_monster')].push(monster.records[it].md5);
                }
            }
            /*jslint continue: false */
            monster.save();

            //PLEASE NOTE BEFORE CHANGING
            //The Serialize Raids and Monsters dictates a 'single-pass' because we only need select
            //one "targetFromxxxx" to fill in. The other MUST be left blank. This is what keeps it
            //serialized!!! Trying to make this two pass logic is like trying to fit a square peg in
            //a round hole. Please reconsider before doing so.
            if (config.getItem('SerializeRaidsAndMonsters', false)) {
                selectTypes = ['any'];
            } else {
                selectTypes = ['battle_monster', 'raid'];
            }

            con.log(3, 'records/monsterList/selectTypes', monster.records, monsterList, selectTypes);
            // We loop through for each selection type (only once if serialized between the two)
            // We then read in the users attack order list

            // current thinking is that continue should not be used as it can cause reader confusion
            // therefore when linting, it throws a warning
            /*jslint continue: true */
            for (s = 0, len1 = selectTypes.length; s < len1; s += 1) {
                if (!$u.hasContent(monsterList[selectTypes[s]])) {
                    continue;
                }

                firstOverAch = '';
                firstUnderMax = '';
                firstFortOverAch = '';
                firstFortUnderMax = '';
                firstStunOverAch = '';
                firstStunUnderMax = '';
                firstStrengthOverAch = '';
                firstStrengthUnderMax = '';
                strengthTarget = '';
                fortifyTarget = '';
                stunTarget = '';
                energyTarget = monster.energyTarget();

                // The extra apostrophe at the end of attack order makes it match any "soandos's monster" so it always selects a monster if available
                if (selectTypes[s] === 'any') {
                    attackOrderList = config.getList('orderbattle_monster', '');
                    $j.merge(attackOrderList, config.getList('orderraid', '').concat('your', "'"));
                } else {
                    attackOrderList = config.getList('order' + selectTypes[s], '').concat('your', "'");
                }

                con.log(3, 'attackOrderList', attackOrderList);
                // Next we step through the users list getting the name and conditions
                for (p = 0, len2 = attackOrderList.length; p < len2; p += 1) {
                    if (!attackOrderList[p].trim()) {
                        continue;
                    }
                    monsterConditions = attackOrderList[p].replace(new RegExp("^[^:]+"), '').toString().trim();
                    // Now we try to match the users name agains our list of monsters
                    for (m = 0, len3 = monsterList[selectTypes[s]].length; m < len3; m += 1) {
                        if (!monsterList[selectTypes[s]][m]) {
                            continue;
                        }

                        monsterObj = monster.getItem(monsterList[selectTypes[s]][m]);
                        // If we set conditions on this monster already then we do not reprocess
                        if (monsterObj.conditions !== 'none') {
                            continue;
                        }
                        // If this monster does not match, skip to next one
                        // Or if this monster is dead, skip to next one
                        // Or if this monster is not the correct type, skip to next one
                        if (!monster.getItem(monsterList[selectTypes[s]][m]).name.toLowerCase().hasIndexOf(attackOrderList[p].match(new RegExp("^[^:]+")).toString().trim().toLowerCase()) ||
                            (selectTypes[s] !== 'any' && monsterObj.page.replace('festival_battle_monster', 'battle_monster').replace('guildv2_monster_list', 'battle_monster') !== selectTypes[s])) {
                            continue;
                        }

                        //Monster is a match so we set the conditions
                        monsterObj.conditions = monsterConditions;
                        monsterObj.select = true;
                        monster.setItem(monsterObj);
                        // If it's complete or collect rewards, no need to process further
                        if (monsterObj.color === 'grey') {
                            continue;
                        }

                        con.log(3, 'Current monster being checked', monsterObj);
                        // checkMonsterDamage would have set our 'color' and 'over' values. We need to check
                        // these to see if this is the monster we should select
                        if (!firstUnderMax && monsterObj.color !== 'purple') {
                            if (monsterObj.over === 'ach') {
                                if (!firstOverAch) {
                                    firstOverAch = monsterList[selectTypes[s]][m];
                                    con.log(3, 'firstOverAch', firstOverAch, monsterObj.name);
                                }
                            } else if (monsterObj.over !== 'max') {
                                firstUnderMax = monsterList[selectTypes[s]][m];
                                con.log(3, 'firstUnderMax', firstUnderMax, monsterObj.name);
                            }
                        }

                        monsterInfo = monster.getInfo(monsterObj);
                        if (monsterInfo) {
                            if (!monsterInfo.alpha || (monsterInfo.alpha && monster.characterClass[monsterObj.charClass] && monster.characterClass[monsterObj.charClass].hasIndexOf('Heal'))) {
                                maxToFortify = (monster.parseCondition('f%', monsterConditions) !== false) ? monster.parseCondition('f%', monsterConditions) : config.getItem('MaxToFortify', 0);
                                if (monsterInfo.fort && !firstFortUnderMax && monsterObj.fortify < maxToFortify) {
                                    if (monsterObj.over === 'ach') {
                                        if (!firstFortOverAch) {
                                            firstFortOverAch = monsterList[selectTypes[s]][m];
                                            con.log(3, 'firstFortOverAch', firstFortOverAch, monsterObj.name);
                                        }
                                    } else if (monsterObj.over !== 'max') {
                                        firstFortUnderMax = monsterList[selectTypes[s]][m];
                                        con.log(3, 'firstFortUnderMax', firstFortUnderMax, monsterObj.name);
                                    }
                                }
                            }

                            if (monsterInfo.alpha) {
                                if (config.getItem("StrengthenTo100", true) && monster.characterClass[monsterObj.charClass] && monster.characterClass[monsterObj.charClass].hasIndexOf('Strengthen')) {
                                    if (!firstStrengthUnderMax && monsterObj.strength < 100) {
                                        if (monsterObj.over === 'ach') {
                                            if (!firstStrengthOverAch) {
                                                firstStrengthOverAch = monsterList[selectTypes[s]][m];
                                                con.log(3, 'firstStrengthOverAch', firstStrengthOverAch, monsterObj.name);
                                            }
                                        } else if (monsterObj.over !== 'max') {
                                            firstStrengthUnderMax = monsterList[selectTypes[s]][m];
                                            con.log(3, 'firstStrengthUnderMax', firstStrengthUnderMax, monsterObj.name);
                                        }
                                    }
                                }

                                if (!firstStunUnderMax && monsterObj.stunDo) {
                                    if (monsterObj.over === 'ach') {
                                        if (!firstStunOverAch) {
                                            firstStunOverAch = monsterList[selectTypes[s]][m];
                                            con.log(3, 'firstStunOverAch', firstStunOverAch, monsterObj.name);
                                        }
                                    } else if (monsterObj.over !== 'max') {
                                        firstStunUnderMax = monsterList[selectTypes[s]][m];
                                        con.log(3, 'firstStunUnderMax', firstStunUnderMax, monsterObj.name);
                                    }
                                }
                            }
                        }
                    }
                }

                // Now we use the first under max/under achievement that we found. If we didn't find any under
                // achievement then we use the first over achievement
                if (selectTypes[s] !== 'raid') {
                    strengthTarget = firstStrengthUnderMax;
                    if (!strengthTarget) {
                        strengthTarget = firstStrengthOverAch;
                    }

                    if (strengthTarget) {
                        energyTarget.md5 = strengthTarget;
                        energyTarget.name = monster.getItem(strengthTarget).name;
                        energyTarget.type = 'Strengthen';
                        con.log(3, 'Strengthen target ', energyTarget.name);
                    }

                    fortifyTarget = firstFortUnderMax;
                    if (!fortifyTarget) {
                        fortifyTarget = firstFortOverAch;
                    }

                    if (fortifyTarget) {
                        energyTarget.md5 = fortifyTarget;
                        energyTarget.name = monster.getItem(fortifyTarget).name;
                        energyTarget.type = 'Fortify';
                        con.log(3, 'Fortify replaces strengthen ', energyTarget.name);
                    }

                    stunTarget = firstStunUnderMax;
                    if (!stunTarget) {
                        stunTarget = firstStunOverAch;
                    }

                    if (stunTarget) {
                        energyTarget.md5 = stunTarget;
                        energyTarget.name = monster.getItem(stunTarget).name;
                        energyTarget.type = 'Stun';
                        con.log(3, 'Stun target replaces fortify ', energyTarget.name);
                    }

                    //state.setItem('targetFromfortify', energyTarget);
                    if (energyTarget.md5) {
                        target.fortify = JSON.copy(energyTarget);
                        con.log(3, 'Energy target', energyTarget);
                    }
                }

                monsterMD5 = firstUnderMax;
                if (!monsterMD5) {
                    monsterMD5 = firstOverAch;
                }

                // If we've got a monster for this selection type then we set the GM variables for the name
                // and stamina requirements
                if (monsterMD5) {
                    monsterObj = monster.getItem(monsterMD5);
                    monsterInfo = monster.getInfo(monsterObj);
                    target[monsterObj.page.replace('festival_battle_monster', 'battle_monster').replace('guildv2_monster_list', 'battle_monster')] = monsterMD5;
                    //state.setItem('targetFrom' + monsterObj.page.replace('festival_battle_monster', 'battle_monster'), monsterMD5);
                    if (monsterObj.page.replace('festival_battle_monster', 'battle_monster').replace('guildv2_monster_list', 'battle_monster') === 'battle_monster') {
                        nodeNum = 0;
                        if (!caap.inLevelUpMode() && monsterInfo && monsterInfo.staLvl) {
                            for (nodeNum = monsterInfo.staLvl.length - 1; nodeNum >= 0; nodeNum -= 1) {
                                if (caap.stats.stamina.max >= monsterInfo.staLvl[nodeNum]) {
                                    break;
                                }
                            }
                        }

                        if (!caap.inLevelUpMode() && monsterInfo && monsterInfo.staMax && config.getItem('PowerAttack', false) && config.getItem('PowerAttackMax', false)) {
                            if (monsterInfo.attack_img) {
                                nodeNum = 1;
                            }

                            state.setItem('MonsterStaminaReq', monsterInfo.staMax[nodeNum]);
                        } else if (monsterInfo && monsterInfo.staUse) {
                            state.setItem('MonsterStaminaReq', monsterInfo.staUse);
                        } else if ((caap.inLevelUpMode() && caap.stats.stamina.num >= 10) || /:pa/i.test(monsterObj.conditions)) {
                            state.setItem('MonsterStaminaReq', 5);
                        } else if (/:sa/i.test(monsterObj.conditions)) {
                            state.setItem('MonsterStaminaReq', 1);
                        } else if ((caap.inLevelUpMode() && caap.stats.stamina.num >= 10) || config.getItem('PowerAttack', true)) {
                            state.setItem('MonsterStaminaReq', 5);
                        } else {
                            state.setItem('MonsterStaminaReq', 1);
                        }

                        switch (theGeneral) {
                        case 'Orc King':
                            state.setItem('MonsterStaminaReq', state.getItem('MonsterStaminaReq', 1) * (Math.min(4, general.GetLevel('Orc King')) + 1));
                            con.log(3, 'MonsterStaminaReq:Orc King', state.getItem('MonsterStaminaReq', 1));
                            break;
                        case 'Barbarus':
                            state.setItem('MonsterStaminaReq', state.getItem('MonsterStaminaReq', 1) * (general.GetLevel('Barbarus') >= 4 ? 3 : 2));
                            con.log(3, 'MonsterStaminaReq:Barbarus', state.getItem('MonsterStaminaReq', 1));
                            break;
                        case 'Maalvus':
                            state.setItem('MonsterStaminaReq', state.getItem('MonsterStaminaReq', 1) * (general.GetLevel('Maalvus') >= 3 ? 3 : 2));
                            con.log(3, 'MonsterStaminaReq:Maalvus', state.getItem('MonsterStaminaReq', 1));
                            break;
                        default:
                        }
                    } else {
                        if (config.getItem('RaidPowerAttack', false) || /:pa/i.test(monsterObj.conditions)) {
                            state.setItem('RaidStaminaReq', 5);
                        } else if (monsterInfo && monsterInfo.staUse) {
                            state.setItem('RaidStaminaReq', monsterInfo.staUse);
                        } else {
                            state.setItem('RaidStaminaReq', 1);
                        }
                    }
                }
            }
            /*jslint continue: false */

            state.setItem('targetFrombattle_monster', target.battle_monster);
            state.setItem('targetFromraid', target.raid);
            state.setItem('targetFromfortify', target.fortify);

            caap.updateDashboard(true);
            return true;
        } catch (err) {
            con.error("ERROR in monster.select: " + err);
            return false;
        }
    };

    monster.confirmRightPage = function(monsterName) {
        try {
            // Confirm name and type of monster
            var monsterDiv = $j("#app_body div[style*='dragon_title_owner'],div[style*='monster_header_'],div[style*='monster_'][style*='_title'],div[style*='monster_'][style*='_header'],div[style*='boss_'][style*='_header'],div[style*='boss_header_']" +
                    (config.getItem("festivalTower", false) ? ",div[style*='festival_monsters_top_']" : "")),
                tempDiv = $j(),
                tempText = '',
                fMonstStyle = '',
                nMonstStyle = '',
                feedMonster = '',
                userName = '',
                mName = '',
                id = 0,
                md5 = '',
                page = $j('#globalContainer .game').eq(0).attr("id");

            if ($u.hasContent(monsterDiv)) {
                fMonstStyle = monsterDiv.attr("style").regex(/(festival_monsters_top_\S+\.jpg)/);
                con.log(2, "confirmRightPage fMonstStyle", fMonstStyle);
                if ($u.hasContent(fMonstStyle)) {
                    tempDiv = $j("div :contains('Summoned'),:contains('summoned')", monsterDiv).last();
                    if ($u.hasContent(tempDiv)) {
                        tempText = $u.setContent(tempDiv.text(), '').trim().innerTrim().replace(/summoned/i, monster.getFestName(fMonstStyle));
                    } else {
                        con.warn("2:Festival monster missing summoned string!");
                    }
                } else {
                    nMonstStyle = monsterDiv.attr("style").regex(/(monster_header_\S+\.jpg|monster_\S+\_header.jpg|monster_\S+\_title.jpg|boss_\S+\_header.jpg|boss_header_\S+\.jpg)/);
                    con.log(2, "confirmRightPage nMonstStyle", nMonstStyle);
                    if ($u.hasContent(nMonstStyle)) {
                        tempDiv = $j("div :contains('Summoned'),:contains('summoned')", monsterDiv).last();
                        if ($u.hasContent(tempDiv)) {
                            tempText = $u.setContent(tempDiv.text(), '').trim().innerTrim().replace(/ summoned/i, "'s " + monster.getNewName(nMonstStyle));
                        } else {
                            con.warn("2:Standard monster missing summoned string!");
                        }
                    } else {
                        tempText = $u.setContent(monsterDiv.children(":eq(2)").text(), '').trim().innerTrim();
                    }
                }

                con.log(2, "confirmRightPage tempText", tempText);
            } else {
                monsterDiv = $j("#app_body div[style*='nm_top']");
                if ($u.hasContent(monsterDiv)) {
                    tempText = $u.setContent(monsterDiv.children(":eq(0)").children(":eq(0)").text(), '').trim().innerTrim();
                    tempDiv = $j("#app_body div[style*='nm_bars']");
                    if ($u.hasContent(tempDiv)) {
                        tempText += ' ' + $u.setContent(tempDiv.children(":eq(0)").children(":eq(0)").children(":eq(0)").siblings(":last").children(":eq(0)").text(), '').trim().replace("'s Life", "");
                    } else {
                        con.warn("Problem finding nm_bars");
                        monsterDiv = null;
                        tempDiv = null;
                        return false;
                    }
                } else {
                    if ($u.hasContent(fMonstStyle)) {
                        $j().alert(fMonstStyle + "<br />I do not know this monster!<br />Please inform me.");
                    }

                    if ($u.hasContent($j("#app_body div[style*='no_monster_back.jpg']"))) {
                        con.log(2, "No monster");
                    } else {
                        con.warn("Problem finding dragon_title_owner and nm_top");
                    }

                    monsterDiv = null;
                    tempDiv = null;
                    return false;
                }
            }

            if ($u.hasContent(monsterDiv)) {
                id = $u.setContent($j("input[name*='casuser']").eq(0).attr("value"), '');
                id = $u.setContent(id, $u.setContent($j("img[src*='profile.ak.fbcdn.net']", monsterDiv).attr("uid"), '').regex(/(\d+)/));
                id = $u.setContent(id, $u.setContent($j(".fb_link[href*='profile.php']", monsterDiv).attr("href"), '').regex(/id=(\d+)/));
                id = $u.setContent(id, $u.setContent($j("img[src*='graph.facebook.com']", monsterDiv).attr("src"), '').regex(/\/(\d+)\//));
                if ($j("input[name*='guild_creator_id']").length > 0) {
                    id = $u.setContent(id, $j("input[name*='guild_creator_id']")[0].value + '_' + $j("input[name='slot']")[0].value + '_' + $j("input[name*='monster_slot']")[0].value);
                }
                id = $u.setContent(id, $u.setContent($j("#app_body #chat_log button[onclick*='ajaxSectionUpdate']").attr("onclick"), '').regex(/user=(\d+)/));
                id = $u.setContent(id, $u.setContent($j("#app_body #monsterChatLogs img[src*='ldr_btn_chatoff.jpg']").attr("onclick"), '').regex(/user=(\d+)/));
                id = $u.setContent(id, 0);

//                this doesn't work with the guild id scheme
//                id = eval(id);
                if (id === 0 || !$u.hasContent(id)) {
                    con.warn("2:Unable to get id!");
                    monsterDiv = null;
                    tempDiv = null;
                    return false;
                }

                if (/Aurelius, Lion's Rebellion/.test(tempText)) {
                    feedMonster = "Aurelius, Lion's Rebellion";
                    userName = tempText.replace(feedMonster, '').trim();
                } else {
                    feedMonster = tempText.replace(new RegExp(".+'s (.+)$"), '$1');
                    userName = tempText.replace(feedMonster, '').trim();
                    feedMonster = feedMonster.trim().innerTrim().toLowerCase().ucWords();
                }

                if (!$u.hasContent(feedMonster)) {
                    con.warn("2:Unable to get monster string!!", tempText);
                    monsterDiv = null;
                    tempDiv = null;
                    return false;
                }
                feedMonster=feedMonster.replace('Baal Stealer Of Souls','BAAL Stealer of Souls');

                if (id === caap.stats.FBID.toString()) {
                    con.log(2, "Your monster found", tempText);
                    userName = 'Your';
                }
            } else {
                con.warn("monster.confirmRightPage monsterDiv issue!");
                monsterDiv = null;
                tempDiv = null;
                return false;
            }

            mName = userName + ' ' + feedMonster;
            con.log(2, 'monster Name', mName);
            if (monsterName !== mName) {
                con.log(2, 'Looking for ' + monsterName + ' but on ' + mName + '. Going back to select screen');
                page = page === 'onMonster' ? 'battle_monster' : (page === 'onRaid' ? 'raid' : page);
                con.log(4, "monster.confirmRightPage page", page);
                monsterDiv = null;
                tempDiv = null;
                md5 = (id + ' ' + feedMonster + ' ' + page).toLowerCase().MD5();
                return caap.navigateTo('keep,' + monster.getItem(md5).page);
            }

            monsterDiv = null;
            tempDiv = null;
            return false;
        } catch (err) {
            con.error("ERROR in monster.confirmRightPage: " + err);
            return false;
        }
    };

    monster.menu = function() {
        try {
            var XMonsterInstructions = "Start attacking if stamina is above this points",
                XMinMonsterInstructions = "Don not attack if stamina is below this points",
                attackOrderInstructions = "List of search words that decide which monster to attack first. " + "Use words in player name or in monster name. To specify max damage follow keyword with " +
                    ":max token and specifiy max damage values. Use 'k' and 'm' suffixes for thousand and million. " + "To override achievement use the ach: token and specify damage values.",
                fortifyInstructions = "Fortify if ship health is below this % (leave blank to disable)",
                questFortifyInstructions = "Do quests if ship health is above this % and quest mode is set to Not Fortify (leave blank to disable)",
                stopAttackInstructions = "Do not attack if ship health is below this % (leave blank to disable)",
                monsterachieveInstructions = "Check if monsters have reached achievement damage level first. Switch when achievement met.",
                demiPointsFirstInstructions = "Do not attack monsters until you have gotten all your demi points from battling. Set 'Battle When' to 'No Monster' or 'Demi Points Only'. " +
                    "Be sure to set battle to Invade or Duel, War does not give you Demi Points.",
                powerattackInstructions = "Use power attacks. Only do normal attacks if power attack not possible",
                powerattackMaxInstructions = "Use maximum power attacks globally on Skaar, Genesis, Ragnarok, and Bahamut types. Only do normal power attacks if maximum power attack not possible",
                powerfortifyMaxInstructions = "Use maximum power fortify globally. Only do normal fortify attacks if maximum power fortify not possible. " +
                    "Also includes other energy attacks, Strengthen, Deflect and Cripple. NOTE: Setting a high forty% can waste energy and no safety on other types.",
                dosiegeInstructions = "Turns on or off automatic siege assist for all monsters only.",
                useTacticsInstructions = "Use the Tactics attack method, on monsters that support it, instead of the normal attack. You must be level 50 or above.",
                useTacticsThresholdInstructions = "If monster health falls below this percentage then use the regular attack buttons instead of tactics.",
                collectRewardInstructions = "Automatically collect monster rewards.",
                strengthenTo100Instructions = "Do not wait until the character class gets a bonus for strengthening but perform strengthening as soon as the energy is available.",
                mbattleList = ['Stamina Available', 'At Max Stamina', 'At X Stamina', 'Stay Hidden', 'Never'],
                mbattleInst = [
                    'Stamina Available will attack whenever you have enough stamina',
                    'At Max Stamina will attack when stamina is at max and will burn down all stamina when able to level up',
                    'At X Stamina you can set maximum and minimum stamina to battle',
                    'Stay Hidden uses stamina to try to keep you under 10 health so you cannot be attacked, while also attempting to maximize your stamina use for Monster attacks. YOU MUST SET BATTLE WHEN TO "STAY HIDDEN" TO USE THIS FEATURE.',
                    'Never - disables attacking monsters'],
                delayStayHiddenInstructions = "Delay staying hidden if \"safe\" to wait for enough stamina to attack monster.",
                monsterDelayInstructions = "Max random delay (in seconds) to battle monsters",
                demiPtItem = 0,
                subCode = '',
                htmlCode = '';

            htmlCode += caap.startToggle('Monster', 'MONSTER');
            htmlCode += caap.makeDropDownTR("Attack When", 'WhenMonster', mbattleList, mbattleInst, '', 'Never', false, false, 62);
            htmlCode += caap.startDropHide('WhenMonster', '', 'Never', true);
            htmlCode += "<div id='caap_WhenMonsterStayHidden_hide' style='color: red; font-weight: bold; display: ";
            htmlCode += (config.getItem('WhenMonster', 'Never') === 'Stay Hidden' && config.getItem('WhenBattle', 'Never') !== 'Stay Hidden' ? 'block' : 'none') + "'>";
            htmlCode += "Warning: Battle Not Set To 'Stay Hidden'";
            htmlCode += "</div>";
            htmlCode += caap.startDropHide('WhenMonster', 'XStamina', 'At X Stamina', false);
            htmlCode += caap.makeNumberFormTR("Start At Or Above", 'XMonsterStamina', XMonsterInstructions, 1, '', '', true, false);
            htmlCode += caap.makeNumberFormTR("Stop At Or Below", 'XMinMonsterStamina', XMinMonsterInstructions, 0, '', '', true, false);
            htmlCode += caap.endDropHide('WhenMonster', 'XStamina', 'At X Stamina', false);
            htmlCode += caap.startDropHide('WhenMonster', 'DelayStayHidden', 'Stay Hidden', false);
            htmlCode += caap.makeCheckTR("Delay hide if \"safe\"", 'delayStayHidden', true, delayStayHiddenInstructions, true);
            htmlCode += caap.endDropHide('WhenMonster', 'DelayStayHidden', 'Stay Hidden', false);
            htmlCode += caap.makeNumberFormTR("Monster delay secs", 'seedTime', monsterDelayInstructions, 300, '', '');
            htmlCode += caap.makeCheckTR("Use Tactics", 'UseTactics', false, useTacticsInstructions);
            htmlCode += caap.startCheckHide('UseTactics');
            htmlCode += caap.makeNumberFormTR("Health threshold", 'TacticsThreshold', useTacticsThresholdInstructions, 75, '', '', true, false);
            htmlCode += caap.endCheckHide('UseTactics');
            htmlCode += caap.makeCheckTR("Power Attack Only", 'PowerAttack', true, powerattackInstructions);
            htmlCode += caap.startCheckHide('PowerAttack');
            htmlCode += caap.makeCheckTR("Power Attack Max", 'PowerAttackMax', false, powerattackMaxInstructions, true);
            htmlCode += caap.endCheckHide('PowerAttack');
            htmlCode += caap.makeCheckTR("Power Fortify Max", 'PowerFortifyMax', false, powerfortifyMaxInstructions);
// siege is changed so disable 
config.setItem('monsterDoSiege', false);
//            htmlCode += caap.makeCheckTR("Siege Weapon Assist Monsters", 'monsterDoSiege', true, dosiegeInstructions);
            htmlCode += caap.makeCheckTR("Collect Monster Rewards", 'monsterCollectReward', false, collectRewardInstructions);
            htmlCode += caap.makeCheckTR("Clear Complete Monsters", 'clearCompleteMonsters', false, '');
            htmlCode += caap.makeCheckTR("Battle Conquest Monsters", 'conquestMonsters', false, '');
            htmlCode += caap.makeCheckTR("Achievement Mode", 'AchievementMode', true, monsterachieveInstructions);
            htmlCode += caap.makeCheckTR("Get Demi Points First", 'DemiPointsFirst', false, demiPointsFirstInstructions);
            htmlCode += caap.startCheckHide('DemiPointsFirst');
            for (demiPtItem = 0; demiPtItem < caap.demiQuestList.length; demiPtItem += 1) {
                subCode += "<span title='" + caap.demiQuestList[demiPtItem] + "'>";
                subCode += "<img alt='" + caap.demiQuestList[demiPtItem] + "' src='data:image/gif;base64," + image64[caap.demiQuestList[demiPtItem]] + "' height='15px' width='15px'/>";
                subCode += caap.makeCheckBox('DemiPoint' + demiPtItem, true);
                subCode += "</span>";
            }

            htmlCode += caap.makeTD(subCode, false, false, "white-space: nowrap;");
            htmlCode += caap.endCheckHide('DemiPointsFirst');
            htmlCode += caap.makeNumberFormTR("Fortify If % Under", 'MaxToFortify', fortifyInstructions, 50, '', '');
            htmlCode += caap.makeNumberFormTR("Quest If % Over", 'MaxHealthtoQuest', questFortifyInstructions, 60, '', '');
            htmlCode += caap.makeNumberFormTR("No Attack If % Under", 'MinFortToAttack', stopAttackInstructions, 10, '', '');
            htmlCode += caap.makeCheckTR("Do not Wait Until Strengthen", 'StrengthenTo100', true, strengthenTo100Instructions);
            htmlCode += caap.makeTD("Attack Monsters in this order <a href='http://caaplayer.freeforums.org/attack-monsters-in-this-order-clarified-t408.html' target='_blank' style='color: blue'>(INFO)</a>");
            htmlCode += caap.makeTextBox('orderbattle_monster', attackOrderInstructions, '', '');
            htmlCode += caap.endDropHide('WhenMonster');
            htmlCode += caap.makeCheckTR("Enable Labels", 'monsterEnableLabels', true, "When enabled then the damage and fortify bars will display percentage labels.");
            htmlCode += caap.endToggle;
            return htmlCode;
        } catch (err) {
            con.error("ERROR in monster.menu: " + err);
            return '';
        }
    };

    monster.dashboard = function() {
        try {
            if (config.getItem('DBDisplay', '') === 'Monster' && session.getItem("MonsterDashUpdate", true)) {
                var headers = ['Name', 'Damage', 'Dmg%', 'Fort%', 'Str%', 'Time', 'T2K', 'Phase', '&nbsp;', '&nbsp;', '&nbsp;'],
                    values = ['name', 'damage', 'life', 'fortify', 'strength', 'time', 't2k', 'phase', 'link'],
                    pp = 0,
                    value = null,
                    color = '',
                    monsterConditions = '',
                    achLevel = 0,
                    maxDamage = 0,
                    title = '',
                    id = '',
                    monsterObjLink = '',
                    visitMonsterLink = '',
                    visitMonsterInstructions = '',
                    removeLink = '',
                    removeLinkInstructions = '',
                    len = 0,
                    data = {
                        text: '',
                        color: '',
                        bgcolor: '',
                        id: '',
                        title: ''
                    },
                    linkRegExp = new RegExp("'(http.+)'"),
                    duration = 0,
                    count = 0,
                    handler = null,
                    monsterInfo = {},
                    head = '',
                    body = '',
                    row = '';

                for (pp = 0, len = headers.length; pp < len; pp += 1) {
                    switch (headers[pp]) {
                    case 'Name':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '30%'
                        });
                        break;
                    case 'Damage':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '13%'
                        });
                        break;
                    case 'Dmg%':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '8%'
                        });
                        break;
                    case 'Fort%':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '8%'
                        });
                        break;
                    case 'Str%':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '8%'
                        });
                        break;
                    case 'Time':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '8%'
                        });
                        break;
                    case 'T2K':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '8%'
                        });
                        break;
                    case 'Link':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '2%'
                        });
                        break;
                    case 'Phase':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '13%'
                        });
                        break;
                    case '&nbsp;':
                        head += caap.makeTh({
                            text: headers[pp],
                            color: '',
                            id: '',
                            title: '',
                            width: '1%'
                        });
                        break;
                    default:
                    }
                }

                head = caap.makeTr(head);
                values.shift();
                monster.records.forEach(function(monsterObj) {
                    row = '';
                    monsterInfo = monster.getInfo(monsterObj);
                    color = monsterObj.color;
                    if (monsterObj.md5 === state.getItem('targetFromfortify', monster.energyTarget()).md5) {
                        color = 'blue';
                    } else if (monsterObj.md5 === state.getItem('targetFrombattle_monster', '') || monsterObj.md5 === state.getItem('targetFromraid', '')) {
                        color = 'green';
                    }

                    monsterConditions = monsterObj.conditions;
                    achLevel = monster.parseCondition('ach', monsterConditions);
                    maxDamage = monster.parseCondition('max', monsterConditions);
                    monsterObjLink = monsterObj.link;
                    if (monsterObjLink) {
                        visitMonsterLink = monsterObjLink.replace("&action=doObjective", "").match(linkRegExp);
                        visitMonsterInstructions = "Clicking this link will take you to " + monsterObj.name;
                        data = {
                            text: '<span id="caap_monster_' + count + '" title="' + visitMonsterInstructions + '" mname="' + monsterObj.name + '" mmd5="' + monsterObj.md5 +
                                '" rlink="' + visitMonsterLink[1] + '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';">' + monsterObj.name + '</span>',
                            color: 'blue',
                            id: '',
                            title: ''
                        };

                        row += caap.makeTd(data);
                    } else {
                        row += caap.makeTd({
                            text: monsterObj.name,
                            color: color,
                            id: '',
                            title: ''
                        });
                    }

                    values.forEach(function(displayItem) {
                        id = "caap_" + displayItem + "_" + count;
                        title = '';
                        if (displayItem === 'phase' && color === 'grey') {
                            row += caap.makeTd({
                                text: monsterObj.status,
                                color: color,
                                id: '',
                                title: ''
                            });
                        } else {
                            value = monsterObj[displayItem];
                            if (value !== '' && (value >= 0 || value.length)) {
                                if (displayItem !== "time" && displayItem !== "t2k" && !$u.isNaN(value) && value > 999) {
                                    value = value.addCommas();
                                }

                                switch (displayItem) {
                                case 'damage':
                                    if (achLevel) {
                                        title = "User Set Monster Achievement: " + achLevel.addCommas();
                                    } else if (config.getItem('AchievementMode', false)) {
                                        title = $u.hasContent(monsterInfo) && $u.isNumber(monsterInfo.ach) ? "Default Monster Achievement: " + monsterInfo.ach.addCommas() : '';
                                        title += monsterObj.page === 'festival_battle_monster' ? ($u.hasContent(monsterInfo) && $u.isNumber(monsterInfo.festival_ach) ? " Festival Monster Achievement: " + monsterInfo.festival_ach.addCommas() : '') : '';
                                    } else {
                                        title = "Achievement Mode Disabled";
                                    }

                                    title += $u.hasContent(maxDamage) && $u.isNumber(maxDamage) ? " - User Set Max Damage: " + maxDamage.addCommas() : '';
                                    break;
                                case 'time':
                                    if ($u.hasContent(value) && value.length === 3) {
                                        value = value[0] + ":" + value[1].lpad("0", 2);
                                        duration = monsterObj.page === 'festival_battle_monster' ? (monsterInfo ? monsterInfo.festival_dur : 192) : (monsterInfo ? monsterInfo.duration : 192);
                                        title = $u.hasContent(duration) ? "Total Monster Duration: " + duration + " hours" : '';
                                    } else {
                                        value = '';
                                    }

                                    break;
                                case 't2k':
                                    value = $u.minutes2hours(value);
                                    title = "Estimated Time To Kill: " + value + " hours:mins";
                                    break;
                                case 'life':
                                    title = "Percentage of monster life remaining: " + value + "%";
                                    break;
                                case 'phase':
                                    value = value + "/" + monsterInfo.siege + " need " + monsterObj.miss;
                                    title = "Siege Phase: " + value + " more clicks";
                                    break;
                                case 'fortify':
                                    title = "Percentage of party health/monster defense: " + value + "%";
                                    break;
                                case 'strength':
                                    title = "Percentage of party strength: " + value + "%";
                                    break;
                                default:
                                }

                                row += caap.makeTd({
                                    text: value,
                                    color: color,
                                    id: id,
                                    title: title
                                });
                            } else {
                                row += caap.makeTd({
                                    text: '',
                                    color: color,
                                    id: '',
                                    title: ''
                                });
                            }
                        }
                    });

                    if (monsterConditions && monsterConditions !== 'none') {
                        data = {
                            text: '<span title="User Set Conditions: ' + monsterConditions + '" class="ui-icon ui-icon-info">i</span>',
                            color: 'blue',
                            id: '',
                            title: ''
                        };

                        row += caap.makeTd(data);
                    } else {
                        row += caap.makeTd({
                            text: '',
                            color: color,
                            id: '',
                            title: ''
                        });
                    }

                    if (monsterObjLink) {
                        removeLink = monsterObjLink.replace("casuser", "remove_list").replace("&action=doObjective", "").regex(linkRegExp) + (monsterObj.page === 'festival_battle_monster' ? '&remove_monsterKey=' + monsterObj.mid.replace("&mid=", "") : '');
                        removeLinkInstructions = "Clicking this link will remove " + monsterObj.name + " from both CA and CAAP!";
                        data = {
                            text: '<span id="caap_remove_' + count + '" title="' + removeLinkInstructions + '" mname="' + monsterObj.name + '" mmd5="' + monsterObj.md5 +
                                '" rlink="' + removeLink + '" onmouseover="this.style.cursor=\'pointer\';" onmouseout="this.style.cursor=\'default\';" class="ui-icon ui-icon-circle-close">X</span>',
                            color: 'blue',
                            id: '',
                            title: ''
                        };

                        row += caap.makeTd(data);
                    } else {
                        row += caap.makeTd({
                            text: '',
                            color: color,
                            id: '',
                            title: ''
                        });
                    }

                    body += caap.makeTr(row);
                    count += 1;
                });

                $j("#caap_infoMonster", caap.caapTopObject).html(
                $j(caap.makeTable("monster", head, body)).dataTable({
                    "bAutoWidth": false,
                    "bFilter": false,
                    "bJQueryUI": false,
                    "bInfo": false,
                    "bLengthChange": false,
                    "bPaginate": false,
                    "bProcessing": false,
                    "bStateSave": true,
                    "bSortClasses": false,
                    "aoColumnDefs": [{
                        "bSortable": false,
                        "aTargets": [8, 9, 10]
                    }, {
                        "sSortDataType": "remaining-time",
                        "aTargets": [5, 6]
                    }]
                }));

                handler = function(e) {
                    var visitMonsterLink = {
                        mmd5: '',
                        mname: '',
                        rlink: '',
                        arlink: ''
                    },
                    i = 0,
                        len = 0;

                    for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                        if (e.target.attributes[i].nodeName === 'mname') {
                            visitMonsterLink.mname = e.target.attributes[i].nodeValue;
                        } else if (e.target.attributes[i].nodeName === 'rlink') {
                            visitMonsterLink.rlink = e.target.attributes[i].nodeValue;
                            visitMonsterLink.arlink = visitMonsterLink.rlink.replace(caap.domain.altered + "/", "");
                        } else if (e.target.attributes[i].nodeName === 'mmd5') {
                            visitMonsterLink.mmd5 = e.target.attributes[i].nodeValue;
                        }
                    }

                    feed.setScanRecord(visitMonsterLink.mmd5);
                    caap.clickAjaxLinkSend(visitMonsterLink.arlink);
                };

                $j("span[id*='caap_monster_']", caap.caapTopObject).off('click', handler).on('click', handler);
                handler = null;

                handler = function(e) {
                    var monsterRemove = {
                        mmd5: '',
                        mname: '',
                        rlink: '',
                        arlink: ''
                    },
                    i = 0,
                        len = 0,
                        resp = false;

                    for (i = 0, len = e.target.attributes.length; i < len; i += 1) {
                        if (e.target.attributes[i].nodeName === 'mname') {
                            monsterRemove.mname = e.target.attributes[i].nodeValue;
                        } else if (e.target.attributes[i].nodeName === 'rlink') {
                            monsterRemove.rlink = e.target.attributes[i].nodeValue;
                            monsterRemove.arlink = monsterRemove.rlink.replace(caap.domain.altered + "/", "");
                        } else if (e.target.attributes[i].nodeName === 'mmd5') {
                            monsterRemove.mmd5 = e.target.attributes[i].nodeValue;
                        }
                    }

                    resp = confirm("Are you sure you want to remove " + monsterRemove.mname + "?");
                    if (resp === true) {
                        monster.deleteItem(monsterRemove.mmd5);
                        caap.updateDashboard(true);
                        caap.clickGetCachedAjax(monsterRemove.arlink);
                    }
                };

                $j("span[id*='caap_remove_']", caap.caapTopObject).off('click', handler).on('click', handler);
                handler = null;
                session.setItem("MonsterDashUpdate", false);
            }

            return true;
        } catch (err) {
            con.error("ERROR in monster.dashboard: " + err);
            return false;
        }
    };

}());
