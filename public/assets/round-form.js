
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {

    console.log('init')

    const options = {
        enableTime: true,
        dateFormat: 'Z'
    };

    var roundStartPicker =  new Pikaday({ field: document.getElementById('start') });
    var roundEndPicker =  new Pikaday({ field: document.getElementById('end') });
    var voteStartPicker =  new Pikaday({ field: document.getElementById('vote_start') });
    var voteEndPicker =  new Pikaday({ field: document.getElementById('vote_end') });


}



function formSubmit(e) {
    e.preventDefault();

    const formData = new FormData(document.forms[0]);

    if (formData.get('last') === 'on') {
        formData.set('last', true)
    } else {
        formData.set('last', false)
    }

    const object = {};

    let players = [];
    formData.forEach(function(value, key){

        if (key.indexOf('player') > -1) {
            players.push(value)
        } else {
            object[key] = value;
        }
    });


    object.players = players;

    const json = JSON.stringify(object);

    fetch('/round', {
        method: "post",
        body: json,
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.status === 200) {
                console.log('OK!')
                window.location = '/admin';
            } else {
                alert('ERROR')
                console.log(response.body)
            }
        })

}