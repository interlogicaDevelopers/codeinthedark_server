var DOMAIN = '';

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