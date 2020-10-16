const link = 'https://games-app-siit.herokuapp.com/games';

window.games = [];

display();

function display() {
    
    fetch(link)
    .then(getRespUnc => getRespUnc.json()).then(function(getResp) {
        
        console.log(getResp);

        for (game of getResp) {
            
            document.querySelector('[data-games-container]').innerHTML += 
            
            `<div data-id="${game._id}">
            <div class = 'heading'>
            <input type='button' value='Edit Game' class='btn-edit' id='${game._id}' onclick='editGame(this.id)'>
            <span data-container-title="${game._id}">${game.title}</span>
            <input type='button' value='Remove Game' class='btn-delete' id='${game._id}' onclick='deleteGame(this.id)'>
            </div>
            <img src="${game.imageUrl}" data-container-url="${game._id}">
            <p data-container-p="${game._id}">${game.description}</p>
            </div>`;
        }
        
    })
}; 

function deleteGame(deletedId) {

    fetch(`${link}/${deletedId}`, {

        method: 'DELETE'
    }).then(function() {

        document.querySelector(`[data-id="${deletedId}"]`).remove();
    });
}

function editGame(editedId) {

    const modal = document.querySelector('[data-modal="modal"]');
    const modalBtn = document.querySelector('[data-modal="exit"]');

    document.querySelector('[data-modal="heading"]').innerText = 'Edit Game';
    document.querySelector('[data-modal="trigger"]').value = 'Edit Game';
            
    document.querySelector('[data-modal="title"]').value = document.querySelector(`[data-container-title="${editedId}"]`).innerText;
    document.querySelector('[data-modal="url"]').value = document.querySelector(`[data-container-url="${editedId}"]`).getAttribute('src');
    document.querySelector('[data-modal="description"]').value = document.querySelector(`[data-container-p="${editedId}"]`).innerText;

    modal.style.display = 'block';

    modalBtn.addEventListener("click", function() {

        modal.style.display = 'none';
        document.querySelector('[data-modal="title"]').value = '';
        document.querySelector('[data-modal="url"]').value = '';
        document.querySelector('[data-modal="description"]').value = '';
    });

    function triggerHandlerEdit() {

        const body = {

            description: document.querySelector('[data-modal="description"]').value,
            imageUrl: document.querySelector('[data-modal="url"]').value,
            title: document.querySelector('[data-modal="title"]').value
        }

        fetch(link + '/' + editedId, {

            method: 'PUT',

            headers: {

                'Content-type': 'application/x-www-form-urlencoded'
            },

            body: new URLSearchParams(body)

        }).then(function() {

            fetch(link + '/' + editedId, {

                method: 'GET'

            }).then(editRespUn => editRespUn.json())

            .then(function(editResp) {

                console.log(editResp);

                document.querySelector(`[data-container-title="${editResp._id}"]`).innerText = editResp.title;
                document.querySelector(`[data-container-url="${editResp._id}"]`).setAttribute('src', editResp.imageUrl);
                document.querySelector(`[data-container-p="${editResp._id}"]`).innerText = editResp.description;

                document.querySelector('[data-modal="title"]').value = '';
                document.querySelector('[data-modal="url"]').value = '';
                document.querySelector('[data-modal="description"]').value = '';

                modal.style.display = 'none';
                document.querySelector('[data-modal="trigger"]').removeEventListener('click', triggerHandlerEdit);
            })
        })
    }

    document.querySelector('[data-modal="trigger"]').addEventListener('click', triggerHandlerEdit);

}

function addGame() {

    const modal = document.querySelector('[data-modal="modal"]');
    const modalBtn = document.querySelector('[data-modal="exit"]');

    document.querySelector('[data-modal="heading"]').innerText = 'Add Game';
    document.querySelector('[data-modal="trigger"]').value = 'Add Game';

    modal.style.display = 'block';

    modalBtn.addEventListener("click", function() {

        modal.style.display = 'none';
        document.querySelector('[data-modal="title"]').value = '';
        document.querySelector('[data-modal="url"]').value = '';
        document.querySelector('[data-modal="description"]').value = '';
    });

    function triggerHandlerAdd() {

        const body = {

            description: document.querySelector('[data-modal="description"]').value,
            imageUrl: document.querySelector('[data-modal="url"]').value,
            title: document.querySelector('[data-modal="title"]').value
        }
        
        fetch(link, {
            method: 'POST',
            headers: {
                
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(body)
            
        })
        .then(function() {

             fetch(link).then(addRespUn => addRespUn.json())
             .then(function(addResp) {

                 addResp = addResp[addResp.length - 1];

                 console.log(addResp);

                 document.querySelector('[data-games-container]').innerHTML += 
                
                `<div data-id="${addResp._id}">
                <div class = 'heading'>
                <input type='button' value='Edit Game' class='btn-edit' id='${addResp._id}' onclick='editGame(this.id)'>
                <span data-container-title="${addResp._id}">${addResp.title}</span>
                <input type='button' value='Remove Game' class='btn-delete' id='${addResp._id}' onclick='deleteGame(this.id)'>
                </div>
                <img src="${addResp.imageUrl}" data-container-url="${addResp._id}">
                <p data-container-p="${addResp._id}">${addResp.description}</p>
                </div>`;

                document.querySelector('[data-modal="title"]').value = '';
                document.querySelector('[data-modal="url"]').value = '';
                document.querySelector('[data-modal="description"]').value = '';
                 
                 modal.style.display = 'none';

                document.querySelector('[data-modal="trigger"]').removeEventListener('click', triggerHandlerAdd);
            })
        });
    }

    document.querySelector('[data-modal="trigger"]').addEventListener('click', triggerHandlerAdd);
}

function regenerate() {

    fetch('https://games-app-siit.herokuapp.com/regenerate-games').then(function() {

        document.querySelector('[data-games-container]').innerHTML = '';

        display();
    })
}