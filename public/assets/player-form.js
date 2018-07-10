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
                console.log('OK!');
                window.location = '/admin';
            } else {
                alert('ERROR');
                console.log(response.body)
            }
        })

}