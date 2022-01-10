function showPlayers() {
    console.log('showPlayers');
    $('#showPlayers').attr('disabled', 'disabled');
    let teams = [];
    let teamPlayers = {};
    $('div.grid-flex.spacing-large.mobile-vertical.tablet-vertical a').each((ix, elem) => {
        let $elem = $(elem);
        let teamName = $elem.text().trim();
        teams.push(teamName);
        let url = $elem.prop('href') + 'info';
        $elem.removeAttr('href');
        $.ajax({
            url: url,
            async: false
        }).done(function(data) {
            let $identity = $elem.find('div.identity');
            $identity.append($('<hr/>'));
            let players = [];
            $(data).find('div.text.bold').each((ix, playerElem) => {
                let playerName = $(playerElem).text().trim();
                players.push(playerName);
                let $name = $('<div class="name"></div>');
                $name.text(playerName);
                $identity.append($name);
            });
            teamPlayers[teamName] = players;
        });
    });
    let $textarea = $('<textarea></textarea>');
    $textarea.css({width: '100%', 'min-height': '400px', 'font-family': 'monospace'});
    let wikicode = '';
    $textarea.text(teams.map(team => {
        let teamCard = '{{TeamCard\n';
        teamCard += '|team=' + team + '\n';
        teamCard += '|image=\n';
        teamPlayers[team].forEach((player, ix) => {
            let i = ix + 1;
            teamCard += '|p' + i + '=' + player + ' ';
            teamCard += '|p' + i + 'flag= ';
            teamCard += '|pos' + i + '=\n';
        });
        teamCard += '}}\n';
        return teamCard;
    }).join('{{box|break|padding=2em}}\n'));
    $('h2:contains("Participants")').parent().parent().append($textarea);
}

$(document).ready(function() {
    let $title = $('h2:contains("Participants")');
    console.log($title.length);
    if ($title.length) {
        let $button = $('<input/>');
        $title.parent().append($button);
        $button.attr({
            'id': 'showPlayers',
            'type': 'button',
            'value': 'Show Players'
        });
        $button.click(showPlayers);
    }
});
