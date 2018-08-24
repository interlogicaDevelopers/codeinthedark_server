const DOMAIN = '';

document.addEventListener('DOMContentLoaded', function() {
    initSocket();
    convertDates();
});

function convertDates() {

    let dates = document.getElementsByClassName('date-convertible');
    for (let i = 0; i < dates.length; i++) {
        let d = new Date(dates[i].innerHTML);
        dates[i].innerHTML = d.getHours() + ':' + (d.getMinutes()<10?'0'+d.getMinutes():d.getMinutes());
    }

}

let hilighted = '';

function initSocket() {
    const endpoint = '/';

    const socket = io(endpoint, {query: "user=admin"});

    socket.on('connect', () => {
        console.log('connect')
    });

    const dataBox = document.querySelector('#socket-status');
    const typeBox = document.querySelector('#socket-status-message');

    socket.on('message', (message) => {
        dataBox.innerHTML = JSON.stringify(message.data);
        typeBox.innerHTML = message.type;

        hilighted = '';

        if (message.data.round) {
            hilighted = message.data.round;
        }

        const h = document.getElementById(hilighted);
        if (h) {
            h.classList.add('current')
        }

    });

    socket.on('adminMessage', message => {

        let val;
        let socketsConnectedEl = document.querySelector('#sockets-connected');

        switch(message.type) {
            case 'SOCKET_CONNECTION':
                val = parseInt(socketsConnectedEl.innerHTML);
                socketsConnectedEl.innerHTML = (val + 1).toString();
                break;
            case 'SOCKET_DISCONNECTION':
                val = parseInt(socketsConnectedEl.innerHTML);
                socketsConnectedEl.innerHTML = (val - 1).toString();
                break;
            default:
                break;
        }


    });

    fetch(DOMAIN + '/sockets')
        .then(response => {
            return response.json()
        })
        .then(response => {
            document.querySelector('#sockets-connected').innerHTML = response.sockets.length;
        })
        .catch(error => {
            alert(JSON.stringify(error))
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


function waiting(id) {
    console.log('waiting', id)

    fetch(DOMAIN + '/round/waiting/' + id, {
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



function startEventCountdown(id) {
    console.log('start event countdown', id);

    fetch(DOMAIN + '/event/startCountdown', {
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

function stopEventCountdown(id) {
    console.log('stop event countdown', id)

    fetch(DOMAIN + '/event/stopCountdown', {
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