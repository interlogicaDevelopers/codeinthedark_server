function formSubmit(e) {
    e.preventDefault();

    const formData = new FormData(document.forms[0]);

    const object = {};

    formData.forEach(function(value, key){
            object[key] = value;
    });


    const json = JSON.stringify(object);

    fetch('/create-player', {
        method: "post",
        body: json,
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (response.status === 200) {
                alert('Player created!');
                window.location = '/hippos';
            } else {
                alert('ERROR');
                console.log(response.body)
            }
        })

}