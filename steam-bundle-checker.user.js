// ==UserScript==
// @name         Steam Bundle Checker
// @namespace    https://sergiosusa.com/
// @version      0.8
// @description  Check against your steam library if you have already got the games of humblebundle, indiegala and fanatical bundles.
// @author       Sergio Susa (sergio@sergiosusa.com)
// @match        https://www.humblebundle.com/games/*
// @match        https://www.fanatical.com/*/bundle/*
// @match        https://www.fanatical.com/*/pick-and-mix/*
// @match        https://www.indiegala.com/bundle/*
// @match        http://dailyindiegame.com/site_weeklybundle_*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/elasticlunr/0.9.6/elasticlunr.js
// ==/UserScript==

(function () {
    'use strict';

    try {
        let steamApi = new SteamAPI();
        let checkerFactory = new CheckerFactory();
        let checker = checkerFactory.createChecker(getDomainFromCurrentUrl());

        steamApi.getOwnedGames().then(
            (games) => {
                checker.check(games);
            }
        );
    } catch (exception) {
        alert(exception);
    }
})();

function CheckerFactory() {

    this.createChecker = (page) => {
        let checker;

        switch (page) {
            case 'humblebundle':
                checker = new HumbleBundle();
                break;
            case 'indiegala':
                checker = new IndieGala();
                break;
            case 'fanatical':
                checker = new Fanatical();
                break;
            case 'dailyindiegame':
                checker = new DailyIndieGame();
                break;
        }
        return checker;
    }
}

function Checker() {
    this.own = [];
    this.notOwn = [];

    this.compareGames = (games, myGames) => {

        for (let x = 0; x < games.length; x++) {

            let gameName = this.clearGameName(games[x].name);
            let results = myGames.search(gameName);

            let result = this.findExactMatch(results, gameName);

            if (result) {
                games[x].url = result.doc.url;
                this.own.push(games[x]);
            } else {
                games[x].url = this.getSearchUrl(gameName);
                this.notOwn.push(games[x]);
            }
        }
    };

    this.findExactMatch = (results, gameName) => {
        for (let y = 0; y < results.length; y++) {
            if (this.exactMatch(results[y].doc.name, gameName)) {
                return results[y];
            }
        }
        return null;
    };

    this.exactMatch = (resultGame, myGame) => {
        return resultGame.toLowerCase() === myGame.toLowerCase();
    };

    this.clearGameName = (gameName) => {
        return gameName.replace('Locked content', '').replace('Product details', '').replace('Detalles del producto').trim();
    };

    this.getSearchUrl = (gameName) => {
        return 'https://store.steampowered.com/search/?term=' + gameName;
    };
}

function HumbleBundle() {

    Checker.call(this);

    this.check = (myGames) => {
        let games = this.getGamesTitles();

        this.compareGames(games, myGames);

        for (let x = 0; x < this.own.length; x++) {
            this.addResult(this.own[x].node, '#C92B2F', 'Own', this.own[x].url);
        }

        for (let y = 0; y < this.notOwn.length; y++) {
            this.addResult(this.notOwn[y].node, '#18a3ff', 'Not Own', this.notOwn[y].url);
        }
    };

    this.addResult = (item, color, text, link) => {
        item.parentElement.style.border = "solid " + color;
        let responseDiv = document.createElement('div');
        responseDiv.classList.add('left');
        responseDiv.classList.add('bundle-page-tier-item-trading');

        if (link != null) {
            text = '<a onclick="window.open(\'' + link + '\');" style="cursor:pointer">' + text + '</a>';
        }

        responseDiv.innerHTML = '<span style="color:' + color + ';margin-left:0;font-weight: bold;background:none;display:inline;margin-left: 17px;">(' + text + ')</span>';
        item.appendChild(responseDiv);
    };

    this.getGamesTitles = () => {

        let games = [];
        let names = document.querySelectorAll('.dd-image-box-white');

        for (let x = 0; x < names.length; x++) {
            games.push(
                {
                    name: names[x].innerText.replace('Locked content', '').trim(),
                    node: names[x]
                }
            );
        }

        return games;
    }
}

HumbleBundle.prototype = Object.create(Checker.prototype);

function IndieGala() {

    Checker.call(this);

    this.check = (myGames) => {
        let games = this.getGamesTitles();
        this.compareGames(games, myGames);
        this.showResults();
    };

    this.showResults = () => {
        for (let x = 0; x < this.own.length; x++) {
            this.addResult(this.own[x].node, '#EA242A', 'Own', this.own[x].url);
        }

        for (let y = 0; y < this.notOwn.length; y++) {
            this.addResult(this.notOwn[y].node, '#18a3ff', 'Not Own', this.notOwn[y].url);
        }
    };

    this.addResult = (item, color, text, link) => {
        item.parentElement.parentElement.style.border = "solid " + color;
        let responseDiv = document.createElement('div');
        responseDiv.classList.add('left');
        responseDiv.classList.add('bundle-page-tier-item-trading');

        if (link != null) {
            text = '<a onclick="window.open(\'' + link + '\');" style="cursor:pointer">' + text + '</a>';
        }

        responseDiv.innerHTML = '<span style="color:' + color + ';margin-left:0;font-weight: bold;background:none;display:inline;margin-left: 17px;">(' + text + ')</span>';
        item.parentElement.parentElement.querySelector('.overflow-auto').appendChild(responseDiv);
        item.parentElement.parentElement.querySelector('.fit-click').style.height = '80%';
    };

    this.getGamesTitles = () => {
        let games = [];
        let images = document.querySelectorAll('.bundle-page-tier-item-col > div > div > figure >img.img-fit');

        for (let x = 0; x < images.length; x++) {
            games.push(
                {
                    name: images[x].getAttribute('alt'),
                    node: images[x]
                }
            );
        }

        return games;
    }
}

IndieGala.prototype = Object.create(Checker.prototype);

function Fanatical() {

    Checker.call(this);

    this.check = (myGames) => {
        let games = this.getGamesTitles();
        this.compareGames(games, myGames);

        for (let x = 0; x < this.own.length; x++) {
            this.addResult(this.own[x].node, '#D88000', 'Own', this.own[x].url);
        }

        for (let y = 0; y < this.notOwn.length; y++) {
            this.addResult(this.notOwn[y].node, '#18a3ff', 'Not Own', this.notOwn[y].url);
        }
    };

    this.addResult = (item, color, text, link) => {

        item.parentElement.parentElement.querySelector('.card-content').style.border = "solid " + color;
        let responseDiv = document.createElement('div');

        if (link != null) {
            text = '<a onclick="window.open(\'' + link + '\');" style="cursor:pointer">' + text + '</a>';
        }

        responseDiv.innerHTML = '<span style="color:' + color + ';margin-left:0;font-weight: bold;background:none;display:inline;">(' + text + ')</span>';
        item.parentElement.parentElement.querySelector('.card-icons-price-container').appendChild(responseDiv);
    };

    this.getGamesTitles = () => {

        let games = [];
        let cards = document.querySelectorAll('.card-overlay');

        for (let x = 0; x < cards.length; x++) {
            games.push(
                {
                    name: cards[x].innerText.replace('Product details', '').replace('Detalles del producto', '').replace('ADD', '').trim(),
                    node: cards[x]
                }
            );
        }
        return games;
    }

}

Fanatical.prototype = Object.create(Checker.prototype);

function DailyIndieGame() {
    Checker.call(this);

    this.check = (myGames) => {
        let games = this.getGamesTitles();
        this.compareGames(games, myGames);

        for (let x = 0; x < this.own.length; x++) {
            this.addResult(this.own[x].node, '#D88000', 'Own', this.own[x].url);
        }

        for (let y = 0; y < this.notOwn.length; y++) {
            this.addResult(this.notOwn[y].node, '#18a3ff', 'Not Own', this.notOwn[y].url);
        }

    };

    this.addResult = (item, color, text, link) => {

        item.style.border = "solid " + color;
        let responseDiv = document.createElement('div');

        if (link != null) {
            text = '<a onclick="window.open(\'' + link + '\');" style="cursor:pointer">' + text + '</a>';
        }

        responseDiv.innerHTML = '<span style="color:' + color + ';margin-left:0;font-weight: bold;background:none;display:inline;">(' + text + ')</span>';
        item.appendChild(responseDiv);

    };

    this.getGamesTitles = () => {
        let games = [];
        let cards = document.querySelectorAll("table td.DIG3_14_Orange span.XDIGcontent");

        for (let x = 0; x < cards.length; x++) {
            games.push(
                {
                    name: cards[x].parentElement.parentElement.innerText.replace('view on STEAM', '').trim(),
                    node: cards[x].parentElement.parentElement
                }
            );
        }
        return games;


    };
}

DailyIndieGame.prototype = Object.create(Checker.prototype);

function SteamAPI() {
    const OWN_GAMES_ENDPOINT = 'https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=[STEAM_API_ID]&steamid=[STEAM_USER]&include_appinfo=true';
    const STEAM_GAME_URL = 'https://store.steampowered.com/app/[APP_ID]';
    const STEAM_SEARCH_URL = 'https://store.steampowered.com/search/?term=';

    this.steamUser = null;
    this.steamApiId = null;

    this.getOwnedGames = () => {

        this.retrieveSteamUserInformation();

        return new Promise(((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: OWN_GAMES_ENDPOINT.replace('[STEAM_USER]', this.steamUser).replace("[STEAM_API_ID]", this.steamApiId),
                onload: function (response) {

                    elasticlunr.addStopWords(['™']);

                    var index = elasticlunr(function () {
                        this.addField('name');
                        this.addField('url');
                        this.addField('searchUrl');
                        this.setRef('appId');
                    });

                    let games = JSON.parse(response.responseText).response.games;

                    for (let x = 0; x < games.length; x++) {
                        let appId = games[x].appid;
                        let name = games[x].name.trim().replace('  ', ' ');
                        let url = this.composeGameUrl(games[x].appid);
                        let searchUrl = this.composeSearchUrl();

                        let doc = {
                            "appId": appId,
                            "name": name,
                            "url": url,
                            "searchUrl": searchUrl
                        };

                        index.addDoc(doc);
                    }
                    this.storeGames(this.steamUser, index);
                    resolve(index);
                }.bind(this)
            });
        }).bind(this));
    };

    this.storeGames = (steamUserId, response) => {
        localStorage.setItem(steamUserId, JSON.stringify(response));
    };

    this.retrieveGames = steamUserId => JSON.parse(localStorage.getItem(steamUserId));

    this.composeGameUrl = (appid) => {
        return STEAM_GAME_URL.replace('[APP_ID]', appid)
    };

    this.composeSearchUrl = () => {
        return STEAM_SEARCH_URL;
    };

    this.retrieveSteamUserInformation = () => {
        this.steamApiId = this.retrieveOrAskForVariable('steam-api-id');
        this.steamUser = this.retrieveOrAskForVariable('steam-user');
    };

    this.retrieveOrAskForVariable = (key) => {

        let variable = localStorage.getItem(key);

        if (null === variable || '' === variable) {

            variable = prompt('Enter the ' + key);

            if (null === variable || '' === variable) {
                throw key + ' is mandatory.';
            }
        }

        localStorage.setItem(key, variable);
        return variable;
    };

}


function getDomainFromCurrentUrl() {
    let matches = window.location.href.match(/https?:\/\/(www\.)?([-a-zA-Z0-9@:%._+~#=]{2,256})(\.[a-z]{2,6})/i);
    return matches[2];
}
