//=============================================================================
// RPG Maker MZ - DNMC_enemyTypeToTraits
// ----------------------------------------------------------------------------
// (C)2022 cursed_twitch
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0  2023/02/20 初版
// ----------------------------------------------------------------------------
// [Twitter]: https://twitter.com/cursed_twitch
//=============================================================================

/*:ja
 * @target MZ
 * @plugindesc metaに定義したタイプから自動的に一定の特徴を追加する。
 * @author cursed_twitch
 * @base DNMC_statics
 * @orderAfter DNMC_statics
 * @orderAfter DNMC_randomTroop
 * 
 * @help DNMC_enemyTypeToTraits.js
 */

/**
 * Enemy_Type
 * 
 * The class that contains resistance for element/state/debuff.
 */
class Enemy_Type {
    id = 0;
    name = "";
    element = {
        resist: [],
        reduce: [],
        weak: []
    };
    state = {
        resist: [],
        reduce: [],
        weak: []
    };
    debuff = {
        resist: [],
        reduce: [],
        weak: []
    };

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    get id() {
        return this.id;
    }

    set id(id) {
        this.id = id;
    }

    get name() {
        return this.name;
    }

    set name(name) {
        this.name = name;
    }

    get element() {
        return this.element;
    }

    set element(element) {
        this.element = element;
    }

    get state() {
        return this.state;
    }

    set state(state) {
        this.state = state;
    }

    get debuff() {
        return this.debuff;
    }

    set debuff(debuff) {
        this.debuff = debuff;
    }

}

let ENTYPE_SLIME = new Enemy_Type(1, "slime");
ENTYPE_SLIME.setElement({
    resist: [],
    reduce: [
        ELEMENT.BASH,
        ELEMENT.WATER,
        ELEMENT.LIGHT,
        ELEMENT.DARKNESS
    ],
    weak: [
        ELEMENT.FIRE
    ]
});
ENTYPE_SLIME.setState({
    resist: [
        STATE.BERSERK,
        STATE.CONFUSE,
        STATE.TEMPTATION,
        STATE.VULNERABLE
    ],
    reduce: [],
    weak: []
});
ENTYPE_SLIME.setDebuff({
    resist: [],
    reduce: [],
    weak: []
});

let ENTYPE_DEMON = new Enemy_Type(2, "demon");
ENTYPE_DEMON.setElement({
    resist: [
        ELEMENT.DARKNESS
    ],
    reduce: [],
    weak: [
        ELEMENT.LIGHT
    ]
});
ENTYPE_DEMON.setState({
    resist: [],
    reduce: [
        STATE.DEAD
    ],
    weak: []
});
ENTYPE_DEMON.setDebuff({
    resist: [],
    reduce: [],
    weak: []
});

let ENTYPE_INSECT = new Enemy_Type(3, "insect");
ENTYPE_INSECT.setElement({
    resist: [],
    reduce: [
        ELEMENT.EARTH
    ],
    weak: [
        ELEMENT.FIRE,
        ELEMENT.ICE
    ]
});
ENTYPE_INSECT.setState({
    resist: [],
    reduce: [
        STATE.POISON,
        STATE.DEADLY_POISON
    ],
    weak: [
        STATE.BERSERK,
        STATE.CONFUSE,
        STATE.TEMPTATION,
        STATE.SLEEP
    ]
});
ENTYPE_INSECT.setDebuff({
    resist: [],
    reduce: [],
    weak: []
});

let ENTYPE_BIRD = new Enemy_Type(4, "bird");
ENTYPE_BIRD.setElement({
    resist: [],
    reduce: [
        ELEMENT.WIND
    ],
    weak: []
});
ENTYPE_BIRD.setState({
    resist: [],
    reduce: [
        STATE.TEMPTATION
    ],
    weak: [
        STATE.PARALYZE,
        STATE.POISON,
        STATE.DEADLY_POISON,
        STATE.SLEEP
    ]
});
ENTYPE_BIRD.setDebuff({
    resist: [],
    reduce: [],
    weak: [
        PARAM.AGI
    ]
});

let ENTYPE_SUBSTANCE = new Enemy_Type(5, "substance");
ENTYPE_SUBSTANCE.setElement({
    resist: [
        ELEMENT.DARKNESS
    ],
    reduce: [
        ELEMENT.SLASH,
        ELEMENT.PENETRATE,
        ELEMENT.EARTH
    ],
    weak: []
});
ENTYPE_SUBSTANCE.setState({
    resist: [
        STATE.BERSERK,
        STATE.CONFUSE,
        STATE.TEMPTATION,
        STATE.PHANTOM,
        STATE.PARALYZE,
        STATE.POISON,
        STATE.DEADLY_POISON,
        STATE.SLEEP
    ],
    reduce: [],
    weak: [
        STATE.SILENCE,
        STATE.MAGICAL_POISON,
        STATE.MP_DOUBLECOST
    ]
});
ENTYPE_SUBSTANCE.setDebuff({
    resist: [],
    reduce: [],
    weak: [
        PARAM.ATK,
        PARAM.DEF,
        PARAM.MAT,
        PARAM.MDF,
        PARAM.AGI,
        PARAM.LUK
    ]
});

let ENTYPE_REPTILIAN = new Enemy_Type(6, "reptilian");
ENTYPE_REPTILIAN.setElement({
    resist: [],
    reduce: [],
    weak: [
        ELEMENT.ICE
    ]
});
ENTYPE_REPTILIAN.setState({
    resist: [],
    reduce: [
        STATE.POISON,
        STATE.DEADLY_POISON
    ],
    weak: [
        STATE.BERSERK,
        STATE.CONFUSE,
        STATE.TEMPTATION,
        STATE.PHANTOM,
        STATE.PARALYZE
    ]
});
ENTYPE_REPTILIAN.setDebuff({
    resist: [],
    reduce: [],
    weak: []
});

let ENTYPE_DRAGON = new Enemy_Type(7, "dragon");
ENTYPE_DRAGON.setElement({
    resist: [],
    reduce: [],
    weak: []
});
ENTYPE_DRAGON.setState({
    resist: [
        STATE.DEAD,
        STATE.BERSERK,
        STATE.CONFUSE,
        STATE.TEMPTATION,
        STATE.PHANTOM
    ],
    reduce: [
        STATE.PARALYZE,
        STATE.POISON,
        STATE.DEADLY_POISON
    ],
    weak: [
        STATE.SLEEP
    ]
});
ENTYPE_DRAGON.setDebuff({
    resist: [],
    reduce: [],
    weak: []
});

let ENTYPE_SPIRIT = new Enemy_Type(8, "spirit");
ENTYPE_SPIRIT.setElement({
    resist: [
        ELEMENT.SLASH,
        ELEMENT.PENETRATE,
        ELEMENT.BASH,
        ELEMENT.EARTH
    ],
    reduce: [
        ELEMENT.DARKNESS
    ],
    weak: [
        ELEMENT.WATER,
        ELEMENT.WIND,
        ELEMENT.LIGHT
    ]
});
ENTYPE_SPIRIT.setState({
    resist: [
        STATE.DEAD,
        STATE.PARALYZE,
        STATE.PHANTOM,
        STATE.POISON,
        STATE.DEADLY_POISON,
        STATE.SLEEP,
        STATE.VULNERABLE
    ],
    reduce: [
        STATE.BERSERK,
        STATE.CONFUSE,
        STATE.TEMPTATION,
        STATE.SILENCE
    ],
    weak: [
        STATE.MAGICAL_POISON,
        STATE.MP_DOUBLECOST
    ]
});
ENTYPE_SPIRIT.setDebuff({
    resist: [],
    reduce: [],
    weak: []
});

let ENTYPE_BEAST = new Enemy_Type(9, "beast");
ENTYPE_BEAST.setElement({
    resist: [],
    reduce: [],
    weak: [
        ELEMENT.FIRE,
        ELEMENT.THUNDER
    ]
});
ENTYPE_BEAST.setState({
    resist: [],
    reduce: [],
    weak: []
});
ENTYPE_BEAST.setDebuff({
    resist: [],
    reduce: [],
    weak: []
});

let ENTYPE_BOTANICAL = new Enemy_Type(10, "botanical");
ENTYPE_BOTANICAL.setElement({
    resist: [
        ELEMENT.WATER,
        ELEMENT.EARTH
    ],
    reduce: [
        ELEMENT.WIND
    ],
    weak: [
        ELEMENT.FIRE,
        ELEMENT.ICE
    ]
});
ENTYPE_BOTANICAL.setState({
    resist: [],
    reduce: [],
    weak: []
});
ENTYPE_BOTANICAL.setDebuff({
    resist: [],
    reduce: [],
    weak: []
});

let ENTYPE_UNDEAD = new Enemy_Type(11, "undead");
ENTYPE_UNDEAD.setElement({
    resist: [
        ELEMENT.DARKNESS
    ],
    reduce: [],
    weak: [
        ELEMENT.FIRE,
        ELEMENT.LIGHT
    ]
});
ENTYPE_UNDEAD.setState({
    resist: [
        STATE.DEAD,
        STATE.BERSERK,
        STATE.CONFUSE,
        STATE.TEMPTATION,
        STATE.PARALYZE,
        STATE.POISON,
        STATE.DEADLY_POISON,
        STATE.SLEEP
    ],
    reduce: [],
    weak: []
});
ENTYPE_UNDEAD.setDebuff({
    resist: [],
    reduce: [],
    weak: []
});

let ENTYPE_FAIRY = new Enemy_Type(12, "fairy");
ENTYPE_FAIRY.setElement({
    resist: [],
    reduce: [
        ELEMENT.WIND
    ],
    weak: []
});
ENTYPE_FAIRY.setState({
    resist: [
        STATE.PHANTOM
    ],
    reduce: [
        STATE.MAGICAL_POISON,
        STATE.MP_DOUBLECOST
    ],
    weak: []
});
ENTYPE_FAIRY.setDebuff({
    resist: [],
    reduce: [],
    weak: []
});

let ENTYPE_AQUATIC = new Enemy_Type(13, "aquatic");
ENTYPE_AQUATIC.setElement({
    resist: [
        ELEMENT.WATER
    ],
    reduce: [
        ELEMENT.FIRE,
        ELEMENT.ICE,
        ELEMENT.EARTH,
        ELEMENT.WIND
    ],
    weak: [
        ELEMENT.THUNDER
    ]
});
ENTYPE_AQUATIC.setState({
    resist: [],
    reduce: [],
    weak: []
});
ENTYPE_AQUATIC.setDebuff({
    resist: [],
    reduce: [],
    weak: []
});

let ENTYPE_FIGHTER = new Enemy_Type(14, "fighter");
ENTYPE_FIGHTER.setElement({
    resist: [],
    reduce: [],
    weak: []
});
ENTYPE_FIGHTER.setState({
    resist: [],
    reduce: [],
    weak: [
        STATE.BERSERK,
        STATE.CONFUSE,
        STATE.TEMPTATION,
        STATE.PHANTOM,
        STATE.SLEEP
    ]
});
ENTYPE_FIGHTER.setDebuff({
    resist: [],
    reduce: [],
    weak: []
});

let ENTYPE_MAGICIAN = new Enemy_Type(15, "magician");
ENTYPE_MAGICIAN.setElement({
    resist: [],
    reduce: [],
    weak: []
});
ENTYPE_MAGICIAN.setState({
    resist: [],
    reduce: [
        STATE.BERSERK,
        STATE.CONFUSE,
        STATE.TEMPTATION,
        STATE.PHANTOM,
        STATE.SLEEP
    ],
    weak: []
});
ENTYPE_MAGICIAN.setDebuff({
    resist: [],
    reduce: [],
    weak: []
});

const ENEMY_TYPES = [
    ENTYPE_AQUATIC,
    ENTYPE_BEAST,
    ENTYPE_BIRD,
    ENTYPE_BOTANICAL,
    ENTYPE_DEMON,
    ENTYPE_DRAGON,
    ENTYPE_FAIRY,
    ENTYPE_FIGHTER,
    ENTYPE_INSECT,
    ENTYPE_MAGICIAN,
    ENTYPE_REPTILIAN,
    ENTYPE_SLIME,
    ENTYPE_SPIRIT,
    ENTYPE_SUBSTANCE,
    ENTYPE_UNDEAD
];

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

})();