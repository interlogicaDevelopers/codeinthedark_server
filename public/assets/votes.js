document.addEventListener('DOMContentLoaded', function() {

    fetchVotes();

    setInterval(() => {
        fetchVotes();
    }, 5000)

});


function fetchVotes() {
    const urlTokens = window.location.href.split('/');
    const roundId = urlTokens[urlTokens.length - 1];

    fetch('/vote/' + roundId)
        .then(response => {
            return response.json()
        })
        .then(response => {

            let d = response.map(player => {
               return player.id + ' ---- ' + player.name + ':' + player.votes + '   <img width="100" src="'+ player.preview_url + '">'
            });

            document.querySelector('#data').innerHTML = d.join('<br>');
        })
}