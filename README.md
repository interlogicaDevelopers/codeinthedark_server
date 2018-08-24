# Servizi Backend per APP mobile

---

## CONTENT API

#### GET /config
Ottiene il json di configurazione con i dati di navigazione.
Es:

```javascript
{
    stage: 'dev',
    register: {
        page: '/content/register.html',
        endpoint: '/user'
    },
    navigation: [
        {
            label: 'sponsor',
            icon: 'icon-sponsor.png',
            url: '/content/sponsor.html'
        },
        ...
    ]
}
```

#### POST /user
Aggiunge un utente a database, su aspetta un json nel seguente formato
```javascript
{
    uuid: "uuid-device",
    ... [altri dati]
}
```

#### GET /round
Lista di round che popoleremo durante l'evento


#### GET /round/{roundId}
Informazioni specifiche di un round comprese di players (con rispettive url di jpeg layout generato), url_layout_originale, start e end time
esempio record JSON

```javascript
{
    id: 'ROUND_ID',
    name: 'ROUND_NAME',
    layout_url: 'http://S3_preview_url',
    players: [
        {
            id: 'PLAYER_ID',
            name: 'PLAYER_NAME',
            preview_url: 'http://S3_preview_url'
        },
        ...
    ],
    start: TIMESTAMP in millisecondi,
    end: TIMESTAMP in millisecondi,
    vote_start: TIMESTAMP,
    vote_end: TIMESTAMP
}
```

--- 

## VOTE API

####  POST /vote/{roundId}/{playerId}
Endpoint per effettuare il voto. Come content della richiesta possiamo mettere tutti i metadati
possibili e immaginabili riguardo il device/accunt del votante

#### GET /vote/roundId
Endpoint per i risultati delle votazioni. Tornerà un array ordinato dei players
```javascript
[{
    id: 'PLAYER_ID',
    name: 'PLAYER_NAME',
    votes: NUM_VOTES,
    preview_url: 'http://S3_preview_url'
}]
```

___

## TIMING SOCKETS
Socket in broadcast per il timing dei round
```javascript
Message format
{
    type: 'MESSAGE_TYPE'
    data: 'MESSAGE_PAYLOAD'
}
```

### Message types

#### EVENT COUNTDOWN (quanto manca all'evento)
```javascript
{
    type: 'EVENT_COUNTDOWN'
    data: {missing: '', time: 0}
}
```

#### ROUND COUNTDOWN (quanto manca al prossimo round)
```javascript
{
    type: 'ROUND_COUNTDOWN'
    data: {round: _id, missing: '', time: 0}
}
```

#### ROUND_END_COUNTDOWN
```javascript
{
    type: 'ROUND_END_COUNTDOWN'
    data: {round: _id, missing: '', time: 0, countdownStep: 1}
}
```
countdown step è un contatore da 65 a 0 necessario per il loading delle immagini su app


#### VOTE_COUNTDOWN
```javascript
{
    type: 'VOTE_COUNTDOWN',
    data: {round: _id, missing: '', time: 0}
}
```

#### RECEIVING_RESULTS
```javascript
{
    type: 'RECEIVING_RESULTS',
    data: {round: _id}
}
```

#### SHOWING RESULTS
```javascript
{
    type: 'SHOWING_RESULTS',
    data: {
        round: _id
    }
}
```

#### WAITING
```javascript
{
    type: 'WAITING',
    data: {
        round: _id
    }
}
```