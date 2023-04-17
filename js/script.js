async function load() {
    window.leaderboards = await (await fetch('/cubecraft-leaderboards/data/leaderboards.json')).json()
        .catch(function () {
            this.dataError = true;
        })
    window.player_renders = await (await fetch('/cubecraft-leaderboards/data/player_renders.json')).json()
        .catch(function () {
            this.dataError = true;
        })
    window.players = await (await fetch('/cubecraft-leaderboards/data/players.json')).json()
        .catch(function () {
            this.dataError = true;
        })
    setupTrigges();
    loadOptions(true);
}

function assemble_render_url(username) {
    let players = window.player_renders;
    let player = window.player_renders.renders[username];
    if (player.player_id !== 'default') {
        let url;
        url = `${players.base_url}?playerId=${player.player_id}&default=${players.default}&background=${players.backgrounds[player.background]}&border=${players.borders[player.border]}&hr=${players.hr}`;
        return url
    } else {
        return window.players.default_url
    }
}

function setupTrigges() {
    const gameSelect = document.querySelector("body > div.controls > div.select-wrapper > select");
    const timeframeSelect = document.querySelector("body > div.controls > div.menu > div:nth-child(1) > select");
    const modeSelect = document.querySelector("body > div.controls > div.menu > div:nth-child(2) > select");

    gameSelect.addEventListener('change', () => loadOptions(1));
    timeframeSelect.addEventListener('change', () => loadOptions(2));
    modeSelect.addEventListener('change', () => loadOptions(3));

}

function clearOptions(id) {
    const timeframeSelect = document.querySelector("body > div.controls > div.menu > div:nth-child(1) > select");
    const modeSelect = document.querySelector("body > div.controls > div.menu > div:nth-child(2) > select");

    if (id == 1)
        while (timeframeSelect.firstChild) {
            timeframeSelect.removeChild(timeframeSelect.firstChild);
        }
    if (id == 1)
        while (modeSelect.firstChild) {
            modeSelect.removeChild(modeSelect.firstChild);
        }

}

function loadOptions(event = false) {
    // Get the select elements by class name
    const gameSelect = document.querySelector("body > div.controls > div.select-wrapper > select");
    const timeframeSelect = document.querySelector("body > div.controls > div.menu > div:nth-child(1) > select");
    const modeSelect = document.querySelector("body > div.controls > div.menu > div:nth-child(2) > select");

    clearOptions(event);

    // Populate the select elements with options
    if (event === true) {
        console.log(event)
        Object.keys(window.leaderboards.data).forEach(game => {
            gameSelect.add(new Option(game, game));
        })
    }
    if (event == 1)
        Object.keys(window.leaderboards.data[gameSelect.value]).forEach(timeframe => {
            timeframeSelect.add(new Option(timeframe, timeframe));
        });
    if (event == 1)
        Object.keys(window.leaderboards.data[gameSelect.value][timeframeSelect.value]).forEach(mode => {
            modeSelect.add(new Option(mode, mode));
        });
    loadLeaderboards();
}

function loadLeaderboards() {
    const gameSelect = document.querySelector("body > div.controls > div.select-wrapper > select");
    const timeframeSelect = document.querySelector("body > div.controls > div.menu > div:nth-child(1) > select");
    const modeSelect = document.querySelector("body > div.controls > div.menu > div:nth-child(2) > select");

    leadrboard_window = document.querySelector("body > div.wrapper > div.leaderboard_background")
    while (leadrboard_window.firstChild) {
        leadrboard_window.removeChild(leadrboard_window.firstChild);
    }
    let leaderboard = window.leaderboards.data[gameSelect.value][timeframeSelect.value][modeSelect.value].data
    leaderboard.forEach(player => {
        let item = document.createElement('div');
        item.className = 'leaderboard_item';

        let image = document.createElement('img');
        image.className = 'skin_render';
        image.src = assemble_render_url(player.u);

        let info = document.createElement('div');
        info.className = 'info';

        let username = document.createElement('div');
        username.className = 'username';

        let value = document.createElement('div');
        value.className = 'value';
        username.appendChild(window.mineParse(player.u_c).parsed);

        // place = document.createElement('span');
        // place.className = 'place';
        // place.innerText = `${player.p}: `;
        // username.childNodes[0].insertBefore(place, username.childNodes[0].childNodes[0]);

        let value_h3 = document.createElement('h3');
        value_h3.innerHTML = `Wins: ${player.v}`;
        value.appendChild(value_h3);

        info.appendChild(username);
        info.appendChild(value);

        item.appendChild(image)
        item.appendChild(info)
        leadrboard_window.appendChild(item);
    })
};

window.addEventListener('load', load, false)
