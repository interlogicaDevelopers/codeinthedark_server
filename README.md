# Servizi Backend per APP mobile
Esporremo un backend su un sottodominio interlogica, probabilmente
https://apicitd.interlogica.it

---

## CONTENT API

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

## CONTENT/RENDER

#### /content/???
Questa sezione esporrà le chiamate che forniranno HTML. 
Aspetto per la definizione di questa API per metter in comunicazione voi con chi si occuperò di 
content/grafica per l'app. 

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

#### ROUND COUNTDOWN (quanto manca al prossimo round)
```javascript
{
    type: 'ROUND_COUNTDOWN'
    data: {roundId: '', missing: ''}
}
```

#### ROUND_END_COUNTDOWN
```javascript
{
    type: 'ROUND_END_COUNTDOWN'
    data: {roundId: '', missing: ''}
}
```


#### VOTE_COUNTDOWN
```javascript
{
    type: 'VOTE_COUNTDOWN',
    data: {roundId: '', missing: ''}
}
```

#### FORCE_DATA_REFRESH 
per forzare il refresh dei dati su app quando inseriamo i player per il prossimo round????
```javascript
{
    type: 'FORCE_DATA_REFRESH'
}
```