
document.addEventListener('DOMContentLoaded', function() {
    init();
});

function init() {

    console.log('init')

    const options = {
        enableTime: true,
        dateFormat: 'Z'
    };

    flatpickr("#start", options);
    flatpickr("#end", options);
    flatpickr("#vote_start", options);
    flatpickr("#vote_end", options);



}



function formSubmit(e) {
    e.preventDefault();

    const formData = new FormData(document.forms[0]);

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

    fetch('/create-round', {
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