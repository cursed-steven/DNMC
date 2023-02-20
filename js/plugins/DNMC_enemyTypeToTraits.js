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
ENTYPE_SLIME.element = {
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
};
ENTYPE_SLIME.state = {
    resist: [
        STATE.BERSERK,
        STATE.CONFUSE,
        STATE.TEMPTATION,
        STATE.VULNERABLE
    ],
    reduce: [],
    weak: []
};
ENTYPE_SLIME.debuff = {
    resist: [],
    reduce: [],
    weak: []
};

let ENTYPE_DEMON = new Enemy_Type(2, "demon");
ENTYPE_DEMON.element = {
    resist: [
        ELEMENT.DARKNESS
    ],
    reduce: [],
    weak: [
        ELEMENT.LIGHT
    ]
};
ENTYPE_DEMON.state = {
    resist: [],
    reduce: [
        STATE.DEAD
    ],
    weak: []
};
ENTYPE_DEMON.debuff = {
    resist: [],
    reduce: [],
    weak: []
};

let ENTYPE_INSECT = new Enemy_Type(3, "insect");
ENTYPE_INSECT.element = {
    resist: [],
    reduce: [
        ELEMENT.EARTH
    ],
    weak: [
        ELEMENT.FIRE,
        ELEMENT.ICE
    ]
};
ENTYPE_INSECT.state = {
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
};
ENTYPE_INSECT.debuff = {
    resist: [],
    reduce: [],
    weak: []
};

let ENTYPE_BIRD = new Enemy_Type(4, "bird");
ENTYPE_BIRD.element = {
    resist: [],
    reduce: [
        ELEMENT.WIND
    ],
    weak: []
};
ENTYPE_BIRD.state = {
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
};
ENTYPE_BIRD.debuff = {
    resist: [],
    reduce: [],
    weak: [
        PARAM.AGI
    ]
};

let ENTYPE_SUBSTANCE = new Enemy_Type(5, "substance");
ENTYPE_SUBSTANCE.element = {
    resist: [
        ELEMENT.DARKNESS
    ],
    reduce: [
        ELEMENT.SLASH,
        ELEMENT.PENETRATE,
        ELEMENT.EARTH
    ],
    weak: []
};
ENTYPE_SUBSTANCE.state = {
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
};
ENTYPE_SUBSTANCE.debuff = {
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
};

let ENTYPE_REPTILIAN = new Enemy_Type(6, "reptilian");
ENTYPE_REPTILIAN.element = {
    resist: [],
    reduce: [],
    weak: [
        ELEMENT.ICE
    ]
};
ENTYPE_REPTILIAN.state = {
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
};
ENTYPE_REPTILIAN.debuff = {
    resist: [],
    reduce: [],
    weak: []
};

let ENTYPE_DRAGON = new Enemy_Type(7, "dragon");
ENTYPE_DRAGON.element = {
    resist: [],
    reduce: [],
    weak: []
};
ENTYPE_DRAGON.state = {
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
};
ENTYPE_DRAGON.debuff = {
    resist: [],
    reduce: [],
    weak: []
};

let ENTYPE_SPIRIT = new Enemy_Type(8, "spirit");
ENTYPE_SPIRIT.element = {
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
};
ENTYPE_SPIRIT.state = {
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
};
ENTYPE_SPIRIT.debuff = {
    resist: [],
    reduce: [],
    weak: []
};

let ENTYPE_BEAST = new Enemy_Type(9, "beast");
ENTYPE_BEAST.element = {
    resist: [],
    reduce: [],
    weak: [
        ELEMENT.FIRE,
        ELEMENT.THUNDER
    ]
};
ENTYPE_BEAST.state = {
    resist: [],
    reduce: [],
    weak: []
};
ENTYPE_BEAST.debuff = {
    resist: [],
    reduce: [],
    weak: []
};

let ENTYPE_BOTANICAL = new Enemy_Type(10, "botanical");
ENTYPE_BOTANICAL.element = {
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
};
ENTYPE_BOTANICAL.state = {
    resist: [],
    reduce: [],
    weak: []
};
ENTYPE_BOTANICAL.debuff = {
    resist: [],
    reduce: [],
    weak: []
};

let ENTYPE_UNDEAD = new Enemy_Type(11, "undead");
ENTYPE_UNDEAD.element = {
    resist: [
        ELEMENT.DARKNESS
    ],
    reduce: [],
    weak: [
        ELEMENT.FIRE,
        ELEMENT.LIGHT
    ]
};
ENTYPE_UNDEAD.state = {
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
};
ENTYPE_UNDEAD.debuff = {
    resist: [],
    reduce: [],
    weak: []
};

let ENTYPE_FAIRY = new Enemy_Type(12, "fairy");
ENTYPE_FAIRY.element = {
    resist: [],
    reduce: [
        ELEMENT.WIND
    ],
    weak: []
};
ENTYPE_FAIRY.state = {
    resist: [
        STATE.PHANTOM
    ],
    reduce: [
        STATE.MAGICAL_POISON,
        STATE.MP_DOUBLECOST
    ],
    weak: []
};
ENTYPE_FAIRY.debuff = {
    resist: [],
    reduce: [],
    weak: []
};

let ENTYPE_AQUATIC = new Enemy_Type(13, "aquatic");
ENTYPE_AQUATIC.element = {
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
};
ENTYPE_AQUATIC.state = {
    resist: [],
    reduce: [],
    weak: []
};
ENTYPE_AQUATIC.debuff = {
    resist: [],
    reduce: [],
    weak: []
};

let ENTYPE_FIGHTER = new Enemy_Type(14, "fighter");
ENTYPE_FIGHTER.element = {
    resist: [],
    reduce: [],
    weak: []
};
ENTYPE_FIGHTER.state = {
    resist: [],
    reduce: [],
    weak: [
        STATE.BERSERK,
        STATE.CONFUSE,
        STATE.TEMPTATION,
        STATE.PHANTOM,
        STATE.SLEEP
    ]
};
ENTYPE_FIGHTER.debuff = {
    resist: [],
    reduce: [],
    weak: []
};

let ENTYPE_MAGICIAN = new Enemy_Type(15, "magician");
ENTYPE_MAGICIAN.element = {
    resist: [],
    reduce: [],
    weak: []
};
ENTYPE_MAGICIAN.state = {
    resist: [],
    reduce: [
        STATE.BERSERK,
        STATE.CONFUSE,
        STATE.TEMPTATION,
        STATE.PHANTOM,
        STATE.SLEEP
    ],
    weak: []
};
ENTYPE_MAGICIAN.debuff = {
    resist: [],
    reduce: [],
    weak: []
};

const ENEMY_TYPES = {
    aquatic: ENTYPE_AQUATIC,
    beast: ENTYPE_BEAST,
    bird: ENTYPE_BIRD,
    botanical: ENTYPE_BOTANICAL,
    demon: ENTYPE_DEMON,
    dragon: ENTYPE_DRAGON,
    fairy: ENTYPE_FAIRY,
    fighter: ENTYPE_FIGHTER,
    insect: ENTYPE_INSECT,
    magician: ENTYPE_MAGICIAN,
    reptilian: ENTYPE_REPTILIAN,
    slime: ENTYPE_SLIME,
    spirit: ENTYPE_SPIRIT,
    substance: ENTYPE_SUBSTANCE,
    undead: ENTYPE_UNDEAD
};

/**
 * Element_Enemy_Type
 * 
 * The class that contains resistance for element.
 */
class Element_Enemy_Type {
    id = 0;
    name = "";
    resist = [];
    reduce = [];
    weak = [];

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

    get resist() {
        return this.resist;
    }

    set resist(resist) {
        this.resist = resist;
    }

    get reduce() {
        return this.reduce;
    }

    set reduce(reduce) {
        this.reduce = reduce;
    }

    get weak() {
        return this.weak;
    }

    set weak(weak) {
        this.weak = weak;
    }

}

let FIRE_ENEMY_TYPE = new Element_Enemy_Type(4, "fire");
FIRE_ENEMY_TYPE.resist = [4];
FIRE_ENEMY_TYPE.reduce = [8];
FIRE_ENEMY_TYPE.weak = [5, 7];

let ICE_ENEMY_TYPE = new Element_Enemy_Type(5, "ice");
ICE_ENEMY_TYPE.resist = [5];
ICE_ENEMY_TYPE.reduce = [7];
ICE_ENEMY_TYPE.weak = [4];

let THUNDER_ENEMY_TYPE = new Element_Enemy_Type(6, "thunder");
THUNDER_ENEMY_TYPE.resist = [6];
THUNDER_ENEMY_TYPE.reduce = [4, 9];
THUNDER_ENEMY_TYPE.weak = [];

let EARTH_ENEMY_TYPE = new Element_Enemy_Type(8, "earth");
EARTH_ENEMY_TYPE.resist = [8];
EARTH_ENEMY_TYPE.reduce = [4, 5, 6];
EARTH_ENEMY_TYPE.weak = [7];

let WIND_ENEMY_TYPE = new Element_Enemy_Type(9, "wind");
WIND_ENEMY_TYPE.resist = [4, 5, 6, 7, 8];
WIND_ENEMY_TYPE.reduce = [];
WIND_ENEMY_TYPE.weak = [9];

let DARK_ENEMY_TYPE = new Element_Enemy_Type(11, "dark");
DARK_ENEMY_TYPE.resist = [11];
DARK_ENEMY_TYPE.reduce = [];
DARK_ENEMY_TYPE.weak = [10];

const ELEMENT_ENEMY_TYPES = {
    4: FIRE_ENEMY_TYPE,
    5: ICE_ENEMY_TYPE,
    6: THUNDER_ENEMY_TYPE,
    8: EARTH_ENEMY_TYPE,
    9: WIND_ENEMY_TYPE,
    11: DARK_ENEMY_TYPE
};

(() => {

    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);

})();