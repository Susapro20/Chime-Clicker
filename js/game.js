var Game = function (scope, difficulty) {
    this.Init(scope, difficulty);
};

Game.prototype.Init = function(scope, difficulty) {
    this.scope = scope;

    this.fps = 30;
    this.stepSize = 1 / this.fps;
    this.steps = 0;

    this.scaleMonsterLevelHealth = SCALE_MONSTER_LEVEL_HEALTH[difficulty];

    this.items = this.createItems();
    this.itemsAvailable = [];
    this.upgrades = this.createUpgrades();
    this.upgradesAvailable = [];
    this.upgradesPurchased = [];
    this.monsters = this.createMonsters();
    this.monstersAvailable = [];

    this.chimes = 0;
    this.chimesPerClick = 1;
    this.chimesPerMeep = CHIMES_PER_MEEP;
    this.chimesPerMeepFloor = CHIMES_PER_MEEP;
    this.chimesClickRate = 0;
    this.chimesRate = 0;

    this.meeps = 0;
    this.meepGold = 0; //1 / 1.2;
    this.meepDamage = 5; //1 / 1.2;

    this.gold = STARTING_GOLD;
    this.goldRate = 0;

    this.discovery = 0;
    this.discoveryBase = 0;
    this.discoveryBonus = 1.0;

    this.swiftness = 0;
    this.swiftnessBase = 0;
    this.swiftnessBonus = 1.0;

    this.power = 0;
    this.powerBase = 5;
    this.powerBonus = 1.0;

    this.agility = 0;
    this.agilityBase = 0;
    this.agilityBonus = 1.0;

    this.income = 0;
    this.incomeBase = 0;
    this.incomeBonus = 1.0;

    this.damage = 0;
    this.damageRate = 0;
    this.damagePerClick = 0;
    this.damageClickRate = 0;
    this.monster = null;
    this.monsterHealth = 0;

    this.level = 0;
    this.experience = 0;
    this.experienceRate = 0;
    this.experienceNeeded = EXPERIENCE_NEEDED;
    this.experiencePercent = 0;



};

Game.prototype.createItems = function() {
    var items = {};

    items[RELIC_SHIELD] = new Item(this, 250, 1,      1, 0, 0, 0, 1);
    items[ANCIENT_COIN] = new Item(this, 250, 1,      0, 0, 0, 0, 5);
    items[SPELLTHIEFS_EDGE] = new Item(this, 250, 1,  0, 0, 10, 0, 3);
    items[BOOTS_OF_SPEED] = new Item(this, 750, 2,    0, 1, 0, 0, 0);
    items[RUBY_CRYSTAL] = new Item(this, 750, 2,      5, 0, 0, 0, 0);
    items[AMPLIFYING_TOME] = new Item(this, 3000, 3,  0, 0, 100, 0, 0);
    items[DAGGER] = new Item(this, 3000, 3,           0, 0, 0, 1, 0);

    // TODO: Ward Item
    // items[] = new Item(this, GREEN_WARD, 100, 1, 0, 1, 0, 0, 0);

    return items;
};

Game.prototype.createUpgrades = function() {
    var upgrades = {};

    // Boots of Speed
    upgrades[BOOTS_OF_SWIFTNESS] = new Upgrade(this, BOOTS_OF_SPEED,        8000, 4, 0, 1, 0, 0, 0, [], ITEM_UPGRADE);
    upgrades[BOOTS_OF_MOBILITY] = new Upgrade(this, BOOTS_OF_SPEED,         160000, 6, 0, 3, 0, 0, 0, [BOOTS_OF_SWIFTNESS], ITEM_UPGRADE);
    upgrades[IONIAN_BOOTS_OF_LUCIDITY] = new Upgrade(this, BOOTS_OF_SPEED,  20000000, 9, 0, 4, 0, 5, 0, [BOOTS_OF_MOBILITY], ITEM_UPGRADE);
    upgrades[MERCURYS_TREADS] = new Upgrade(this, BOOTS_OF_SPEED,           1200000000, 12, 60, 6, 0, 0, 0, [IONIAN_BOOTS_OF_LUCIDITY], ITEM_UPGRADE);
    upgrades[SORCERERS_SHOES] = new Upgrade(this, BOOTS_OF_SPEED,           300000000000, 15, 0, 15, 120, 0, 0, [MERCURYS_TREADS], ITEM_UPGRADE);


    // Ancient Coin
    upgrades[NOMADS_MEDALLION] = new Upgrade(this, ANCIENT_COIN,            60000, 5, 0, 2, 0, 0, 25, [], ITEM_UPGRADE);
    upgrades[TALISMAN_OF_ASCENSION] = new Upgrade(this, ANCIENT_COIN,       5000000, 8, 0, 3, 0, 2, 170, [NOMADS_MEDALLION], ITEM_UPGRADE);


    // Spellthief's Edge
    upgrades[FROSTFANG] = new Upgrade(this, SPELLTHIEFS_EDGE,               30000, 5, 0, 0, 20, 0, 12, [], ITEM_UPGRADE);
    upgrades[FROST_QUEENS_CLAIM] = new Upgrade(this, SPELLTHIEFS_EDGE,      3500000, 8, 0, 0, 90, 2, 85, [FROSTFANG], ITEM_UPGRADE);


    // Relic Shield
    upgrades[TARGONS_BRACE] = new Upgrade(this, RELIC_SHIELD,               30000, 5, 3, 0, 0, 0, 9, [], ITEM_UPGRADE);
    upgrades[FACE_OF_THE_MOUNTAIN] = new Upgrade(this, RELIC_SHIELD,        3500000, 8, 6, 0, 0, 2, 70, [TARGONS_BRACE], ITEM_UPGRADE);


    // Ruby Crystal
    upgrades[KINDLEGEM] = new Upgrade(this, RUBY_CRYSTAL,                   80000, 5, 5, 0, 0, 1, 0, [], ITEM_UPGRADE);
    upgrades[LOCKET_OF_THE_IRON_SOLARI] = new Upgrade(this, RUBY_CRYSTAL,   500000000000, 15, 80, 0, 0, 4, 0, [KINDLEGEM], ITEM_UPGRADE);

    upgrades[GIANTS_BELT] = new Upgrade(this, RUBY_CRYSTAL,                 25000000, 9, 20, 0, 0, 0, 0, [], ITEM_UPGRADE);
    upgrades[WARMOGS_ARMOR] = new Upgrade(this, RUBY_CRYSTAL,               500000000, 11, 40, 0, 0, 0, 0, [GIANTS_BELT], ITEM_UPGRADE);
    upgrades[FROZEN_MALLET] = new Upgrade(this, RUBY_CRYSTAL,               12500000000000, 17, 130, 0, 250, 0, 0, [GIANTS_BELT], ITEM_UPGRADE);

    upgrades[CRYSTALLINE_BRACER] = new Upgrade(this, RUBY_CRYSTAL,          800000, 7, 10, 0, 0, 0, 0, [], ITEM_UPGRADE);
    upgrades[RIGHTEOUS_GLORY] = new Upgrade(this, RUBY_CRYSTAL,             12000000000, 13, 60, 5, 0, 0, 0, [CRYSTALLINE_BRACER], ITEM_UPGRADE);


    // Amplifying Tome
    upgrades[FIENDISH_CODEX] = new Upgrade(this, AMPLIFYING_TOME,           200000, 6, 0, 0, 100, 1, 0, [], ITEM_UPGRADE);
    upgrades[TWIN_SHADOWS] = new Upgrade(this, AMPLIFYING_TOME,             6000000, 8, 0, 2, 150, 1, 0, [FIENDISH_CODEX], ITEM_UPGRADE);
    upgrades[MORELLONOMICON] = new Upgrade(this, AMPLIFYING_TOME,           2500000000, 12, 0, 0, 200, 3, 0, [FIENDISH_CODEX], ITEM_UPGRADE);

    upgrades[NEEDLESSLY_LARGE_ROD] = new Upgrade(this, AMPLIFYING_TOME,     100000000, 10, 0, 0, 300, 0, 0, [], ITEM_UPGRADE);
    upgrades[LUDENS_ECHO] = new Upgrade(this, AMPLIFYING_TOME,              50000000000, 14, 0, 3, 450, 0, 0, [NEEDLESSLY_LARGE_ROD], ITEM_UPGRADE);
    upgrades[ZHONYAS_HOURGLASS] = new Upgrade(this, AMPLIFYING_TOME,        1500000000000, 16, 80, 0, 600, 0, 0, [NEEDLESSLY_LARGE_ROD], ITEM_UPGRADE);
    upgrades[RABADONS_DEATHCAP] = new Upgrade(this, AMPLIFYING_TOME,        30000000000000, 18, 0, 0, 1100, 0, 0, [NEEDLESSLY_LARGE_ROD], ITEM_UPGRADE);

    // Dagger
    upgrades[RECURVE_BOW] = new Upgrade(this, DAGGER,                       250000, 6, 0, 0, 0, 2, 0, [], ITEM_UPGRADE);
    upgrades[RUNAANS_HURRICANE] = new Upgrade(this, DAGGER,                 7500000, 8, 0, 0, 20, 3, 0, [RECURVE_BOW], ITEM_UPGRADE);
    upgrades[WITS_END] = new Upgrade(this, DAGGER,                          5000000000, 12, 50, 0, 80, 5, 0, [RECURVE_BOW], ITEM_UPGRADE);

    upgrades[ZEAL] = new Upgrade(this, DAGGER,                              200000000, 10, 0, 3, 0, 4, 0, [], ITEM_UPGRADE);
    upgrades[STATIKK_SHIV] = new Upgrade(this, DAGGER,                      100000000000, 14, 0, 3, 150, 5, 0, [ZEAL], ITEM_UPGRADE);
    upgrades[PHANTOM_DANCER] = new Upgrade(this, DAGGER,                    3000000000000, 16, 0, 4, 0, 10, 0, [ZEAL], ITEM_UPGRADE);
    upgrades[TRINITY_FORCE] = new Upgrade(this, DAGGER,                     75000000000000, 18, 100, 5, 150, 10, 0, [ZEAL], ITEM_UPGRADE);


    // TODO: Spell Upgrades
    // upgrades[FLASH] = new Upgrade(this, null, 1000, 5, 0, 1, 0, 0, 0, [], SPELL_UPGRADE);
    // upgrades[GHOST] = new Upgrade(this, null, 1000, 5, 0, 1, 0, 0, 0, [], SPELL_UPGRADE);
    // upgrades[BARRIER] = new Upgrade(this, null, 1000, 5, 0, 1, 0, 0, 0, [], SPELL_UPGRADE);
    // upgrades[HEAL] = new Upgrade(this, null, 1000, 5, 0, 1, 0, 0, 0, [], SPELL_UPGRADE);
    // upgrades[SMITE] = new Upgrade(this, null, 1000, 5, 0, 1, 0, 0, 0, [], SPELL_UPGRADE);
    // upgrades[IGNITE] = new Upgrade(this, null, 1000, 5, 0, 1, 0, 0, 0, [], SPELL_UPGRADE);
    // upgrades[EXHAUST] = new Upgrade(this, null, 1000, 5, 0, 1, 0, 0, 0, [], SPELL_UPGRADE);
    // upgrades[CLEANSE] = new Upgrade(this, null, 1000, 5, 0, 1, 0, 0, 0, [], SPELL_UPGRADE);
    // upgrades[TELEPORT] = new Upgrade(this, null, 1000, 5, 0, 1, 0, 0, 0, [], SPELL_UPGRADE);

    return upgrades;
};

Game.prototype.createMonsters = function() {
    var monsters = {};
    var monster;
    var scaleHealth;
    var scaleExp;
    var scaleReward;
    var i;

    for (i = 0; i < MONSTERS.length; i++) {
        monster = MONSTERS[i];
        scaleHealth = Math.pow(this.scaleMonsterLevelHealth, i);
        scaleExp = Math.pow(SCALE_MONSTER_LEVEL_REWARD, i);
        scaleReward = Math.pow(SCALE_MONSTER_LEVEL_REWARD, i);
        if (i == MONSTERS.length - 1) {
          scaleHealth *= 10;
          scaleExp = 999999000000000000 / MONSTER_EXPERIENCE;
          scaleReward *= 10;
        }
        monsters[monster] = new Monster(this, i + 1, MONSTER_HEALTH * scaleHealth,
                                                 MONSTER_EXPERIENCE * scaleExp,
                                                 MONSTER_REWARD * scaleReward);
    }
    return monsters;
};

Game.prototype.start = function() {
    this.levelUp();


    var thisRef = this;
    window.setInterval(function() {
        thisRef.step(thisRef.stepSize);
    }, thisRef.stepSize * 1000);
};


// Increment functions
Game.prototype.step = function(step) {
    this.addChimes(this.chimesPerClick * this.chimesClickRate * step);
    this.addDamage(this.damagePerClick * this.damageClickRate * step);
    this.addGold(this.goldRate * step);
    this.addExperience(this.experienceRate * step);

    this.steps++;

    this.updateView();
};

Game.prototype.addChimes = function(chimes) {
    this.chimes += chimes;
    this.addExperience(chimes);
    while (this.chimes >= this.chimesPerMeepFloor) {
        this.chimes -= this.chimesPerMeepFloor;
        this.addMeeps(1);
    }
};

Game.prototype.addDamage = function(damage) {
    this.damage += damage;
    while (this.damage >= this.monsters[this.monster].health) {
        this.damage -= this.monsters[this.monster].health;
        this.killMonster();
    }
    this.monsterHealth = this.monsters[this.monster].health - this.damage;
};

Game.prototype.addGold = function(gold) {
    this.gold += gold;
};

Game.prototype.addExperience = function(experience) {
    this.experience += experience;
    while (this.experience >= this.experienceNeeded) {
        this.experience -= this.experienceNeeded;
        this.levelUp();
    }
    this.experiencePercent = 100 * this.experience / this.experienceNeeded;
};

Game.prototype.addMeeps = function(meeps) {
    this.meeps += meeps;
    this.chimesPerMeep += Math.log2(this.meeps);
    this.chimesPerMeepFloor = Math.floor(this.chimesPerMeep);

    this.updateStats();
};

// Update Functions
Game.prototype.updateStats = function() {
    this.chimesPerClick = 1 + this.discoveryBase * this.discoveryBonus;
    this.chimesClickRate = this.swiftnessBase * this.swiftnessBonus;
    this.chimesRate = this.chimesPerClick * this.chimesClickRate;

    this.damagePerClick = (this.meeps * this.meepDamage) + (this.powerBase * this.powerBonus);
    this.damageClickRate = this.agilityBase * this.agilityBonus;
    this.damageRate = this.damagePerClick * this.damageClickRate;

    this.goldRate = (this.meeps * this.meepGold) + (this.incomeBase * this.incomeBonus);
};

Game.prototype.updateView = function() {
    this.scope.$applyAsync(function(scope) {updateButtons();});
};

Game.prototype.updateItems = function() {
    for (var item in this.items) {
        if (this.items.hasOwnProperty(item)) {
            if (this.level == this.items[item].level) {
                this.itemsAvailable.push(item);
            }
        }
    }
};

Game.prototype.updateUpgrades = function() {
    for (var upgradeName in this.upgrades) {
        if (this.upgrades.hasOwnProperty(upgradeName)) {
            var upgrade = this.upgrades[upgradeName];
            var item = this.items[upgrade.item];
            if (this.level >= upgrade.level &&
                item.upgradesAvailable.indexOf(upgradeName) == -1 &&
                item.upgrades.indexOf(upgradeName) == -1) {
                if (!upgrade.requirements.length || item.upgrades.indexOf(upgrade.requirements[0]) > -1)
                  item.upgradesAvailable.push(upgradeName);
            }
        }
    }
};

Game.prototype.updateMonsters = function() {
    for (var monster in this.monsters) {
        if (this.monsters.hasOwnProperty(monster)) {
            if (this.level == this.monsters[monster].level) {
                this.monstersAvailable.push(monster);
                this.monster = monster;
                this.monsterHealth = this.monsters[monster].health;
            }
            if (this.level - 1 == this.monsters[monster].level) {
                this.monsters[monster].experience /= 5;
            }
        }
    }
};

// Action Functions
Game.prototype.chimesClick = function() {
    this.addChimes(this.chimesPerClick);
    this.updateView();
};

Game.prototype.damageClick = function() {
    this.addDamage(this.damagePerClick);
    this.updateView();
};

Game.prototype.buyItem = function(name, count) {
    count = count ? count : 1;
    var item = this.items[name];
    var bought = 0;

    // control + click buys 5
    // shift + click buys 10
    // control + shift + click buys 50
    // var ctrl = window.event.ctrlKey ? 5 : 1;
    // var shift = window.event.shiftKey ? 10 : 1;
    for (var i = 0; i < count; i++) {
        if (this.gold >= item.cost) {
            this.gold -= item.cost;
            item.count++;
            item.cost += item.startCost * SCALE_ITEM_COST * item.count;
            bought++;

        }
        else {
            break;
        }
    }

    this.discoveryBase += bought * item.discovery;
    this.swiftnessBase += bought * item.swiftness;
    this.powerBase += bought * item.power;
    this.agilityBase += bought * item.agility;
    this.incomeBase += bought * item.income;

    this.updateStats();
    this.updateView();
};

Game.prototype.buyUpgrade = function(name) {
    var upgrade = this.upgrades[name];
    if (this.gold >= upgrade.cost) {
        this.gold -= upgrade.cost;
        upgrade.count += 1;

        if (upgrade.type == ITEM_UPGRADE) {

            // Upgrade all future items
            var item = this.items[upgrade.item];
            item.upgrades.push(name);
            item.discovery += upgrade.discovery;
            item.swiftness += upgrade.swiftness;
            item.power += upgrade.power;
            item.agility += upgrade.agility;
            item.income += upgrade.income;

            // Upgrade all previously bought items
            var count = item.count;
            this.discoveryBase += count * upgrade.discovery;
            this.swiftnessBase += count * upgrade.swiftness;
            this.powerBase += count * upgrade.power;
            this.agilityBase += count * upgrade.agility;
            this.incomeBase += count * upgrade.income;

            item.upgradesAvailable.splice(item.upgradesAvailable.indexOf(name), 1);
            this.upgradesPurchased.push(name);
            this.updateUpgrades();
        }

        this.updateStats();
        this.updateView();
    }
};

Game.prototype.selectMonster = function(direction) {
  var index = this.monstersAvailable.indexOf(this.monster);
  var length = this.monstersAvailable.length;
  direction == 'left' ? index -= 1 : index += 1;

  if (index == -1 || index == length)
    return;

  this.monster = this.monstersAvailable[index];
  this.monsterHealth = this.monsters[this.monster].health;
};

// Threshold functions
Game.prototype.killMonster = function() {
    var monster = this.monsters[this.monster];
    var exp = monster.experience;
    var gold = monster.gold;

    monster.health += monster.startHealth * SCALE_MONSTER_HEALTH;
    monster.experience += monster.startExperience * SCALE_MONSTER_REWARD;
    monster.gold += monster.startGold * SCALE_MONSTER_REWARD;

    this.addExperience(exp);
    this.addGold(gold);

    if (this.monster == TEEMO)
      this.win();

};

Game.prototype.levelUp = function(levels) {
    levels = levels || 1;
    while (levels > 0 && this.level < 19) {
        this.level += 1;


        this.experienceNeeded *= SCALE_EXPERIENCE_NEEDED;

        if (this.level == 19)
          this.experienceNeeded = 999999000000000000;

        // Increase meep damage and gold generation
        this.meepGold *= SCALE_MEEP_STRENGTH;
        this.meepDamage *= SCALE_MEEP_STRENGTH;

        this.updateStats();
        this.updateItems();
        this.updateUpgrades();
        this.updateMonsters();

        levels--;
    };
};

Game.prototype.win = function() {
  console.log('You Win!');
};

// Utility Functions
Game.prototype.getTime = function() {
  return Math.floor(this.steps / this.fps);
};

Game.prototype.prettyTime = function(seconds) {
    var s = seconds % 60;
    var m = Math.floor(seconds / 60) % 60;
    var h = Math.floor(seconds / 3600);

    var str = "";
    if (h)
      str = h + "h " + m + "m " + s + "s";
    else if (m)
      str = m + "m " + s + "s";
    else
      str = s + "s";
    return str;
};

Game.prototype.getImageUrl = function(name, folder) {
    return "images/" + folder + "/" + name.split(" ").join("_").split("'").join("").split(".").join("") + ".png";
};

Game.prototype.getItemImageUrl = function(name) {
    return this.getImageUrl(name + '_U', 'items/upscale');
};

Game.prototype.getMonsterImageUrl = function(name) {
    return this.getImageUrl(name, 'monsters/upscale');
};

Game.prototype.getSpellImageUrl = function(name) {
    return this.getImageUrl(name, 'spells');
};

Game.prototype.getLevelText = function() {
    return this.level == 19 ? 'T' : this.level;
};

Game.prototype.prettyInt = function(num, fixed) {
    return prettyIntBig(num, fixed);
};

Game.prototype.prettyIntCompact = function(num, fixed) {
    return prettyIntBigCompact(num, fixed);
};

Game.prototype.prettyIntVariable = function(num, fixed, width) {
    return window.innerWidth > width ? prettyIntBig(num, fixed) : prettyIntBigCompact(num, fixed);
}

Game.prototype.isPlural = function(num, name) {
    return (num == 1 || $.inArray(name, IGNORE_PLURALS) > -1) ? '' : ($.inArray(name, SPECIAL_PLURALS) > -1 ? 'es': 's');
};

Game.prototype.getMeepProgressPercent = function() {
    return 100 * this.chimes / this.chimesPerMeepFloor;
};

Game.prototype.getMonsterHealthPercent = function() {
    return 100 * this.monsterHealth / this.monsters[this.monster].health;
};

Game.prototype.isFirstMonster = function() {
  var index = this.monstersAvailable.indexOf(this.monster);
  return index == 0 ? 'first' : '';
};

Game.prototype.isLastMonster = function() {
  var index = this.monstersAvailable.indexOf(this.monster);
  return index == this.monstersAvailable.length - 1 ? 'last' : '';
};
