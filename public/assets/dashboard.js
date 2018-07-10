var DOMAIN = '';



document.addEventListener('DOMContentLoaded', function() {
    initSocket();
});

let hilighted = '';

function initSocket() {
    const endpoint = '/';

    const socket = io(endpoint);

    socket.on('connect', () => {
        console.log('connect')
    });

    const dataBox = document.querySelector('#socket-status');
    const typeBox = document.querySelector('#socket-status-message');

    socket.on('message', (message) => {
        dataBox.innerHTML = JSON.stringify(message.data);
        typeBox.innerHTML = message.type;

        hilighted = '';


        console.log(message.data.round)
        if (message.data.round) {
            hilighted = message.data.round;
        }

        const h = document.getElementById(hilighted)
        if (h) {
            h.classList.add('current')
        }


    })
}


function startRound(id) {

    console.log('start Round', id);

    fetch(DOMAIN + '/round/start/' + id, {
        method: 'POST'
    })
        .then(response => {

            if (response.status === 200) {
                console.log('done');
                window.location.reload(true);
            } else {

                alert('error!')
            }



        });


}


function nextRound(id) {

    console.log('next Round', id);

    fetch(DOMAIN + '/round/next/' + id, {
        method: 'POST'
    })
        .then(response => {

            if (response.status === 200) {
                console.log('done');
                window.location.reload(true);
            } else {

                alert('error!')
            }



        });


}

function stopRound(id) {
    console.log('stop Round', id)

    fetch(DOMAIN + '/round/stop/' + id, {
        method: 'POST'
    })
        .then(response => {

            if (response.status === 200) {
                console.log('done');
                window.location.reload(true);
            } else {

                alert('error!')
            }



        });

}

function archiveRound(id) {
    console.log('archive round', id)

    fetch(DOMAIN + '/round/archive/' + id, {
        method: 'POST'
    })
        .then(response => {

            if (response.status === 200) {
                console.log('done');
                window.location.reload(true);
            } else {

                alert('error!')
            }



        });

}

function startVote(id) {
    console.log('start vote', id)

    fetch(DOMAIN + '/round/startVote/' + id, {
        method: 'POST'
    })
        .then(response => {

            if (response.status === 200) {
                console.log('done');
                window.location.reload(true);
            } else {

                alert('error!')
            }



        });

}


function receiveLayouts(id) {
    console.log('receive layouts', id)

    fetch(DOMAIN + '/round/receiveLayouts/' + id, {
        method: 'POST'
    })
        .then(response => {

            if (response.status === 200) {
                console.log('done');
                window.location.reload(true);
            } else {

                alert('error!')
            }



        });

}


function showResults(id) {
    console.log('show results', id)


    fetch(DOMAIN + '/round/showResults/' + id, {
        method: 'POST'
    })
        .then(response => {

            if (response.status === 200) {
                console.log('done');
                window.location.reload(true);
            } else {

                alert('error!')
            }



        });

}

function deleteRound(id) {
    console.log('delete round')


    fetch(DOMAIN + '/round/' + id, {
        method: 'DELETE'
    })
        .then(response => {

            if (response.status === 200) {
                console.log('done');
                window.location.reload(true);
            } else {

                alert('error!')
            }



        });

}

function deletePlayer(id) {
    console.log('delete player')


    fetch(DOMAIN + '/player/' + id, {
        method: 'DELETE'
    })
        .then(response => {

            if (response.status === 200) {
                console.log('done');
                window.location.reload(true);
            } else {

                alert('error!')
            }



        });

}