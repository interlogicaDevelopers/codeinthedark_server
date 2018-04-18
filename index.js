require('dotenv').config()
const _ = require('lodash');
const express = require('express');
const cors = require('cors');
const aws = require('aws-sdk');
const bodyParser = require('body-parser');
const moment = require('moment');

const app = express();
app.use(cors())
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const wrap = require('async-middleware').wrap;

app.use(express.static('public'))
app.use(bodyParser.json()); 



const {Player, Round, Vote} = require('./db');

app.get('/', wrap(async (req, res) => {
    res.send('WELCOME')
}))

app.get('/round', wrap(async (req, res) => {

    const rounds = await Round.find();
    res.json(rounds)
    
}))

app.get('/round/:id', wrap(async (req, res) => {

    const round = await Round.findOne({
        id: req.params.id
    });
    res.json(round)
    
}))

app.post('/vote/:roundId/:playerId', wrap(async (req, res) => {

    const vote = new Vote({
        vote_for: req.params.playerId,
        round: req.params.roundId,
        voter: req.body
    })
    await vote.save();
    
}))

app.get('/vote/:roundId', wrap(async (req, res) => {
    const votes = await Vote.find({
        round: req.params.roundId
    })
    const groups = _.groupBy(votes, vote => vote.vote_for)
    res.json(groups)
}))


io.on('connection', (socket) => {
    console.log('CONNECTION', socket.id)
});


const checkRounds = async () => {

    const nextRound = await Round.findOne({
        next: true
    })

    let missing;

    if (nextRound) {
        console.log('FOUND NEXT ROUND')

        missing = moment(nextRound.start).diff(moment())

        io.sockets.emit('message', {
            type: 'ROUND_COUNTDOWN',
            data: {
                round: nextRound, 
                missing: missing
            }
        })
    }

    const runningRound = await Round.findOne({
        running: true
    })

    if(runningRound) {
        console.log('FOUND RUNNING ROUND')

        missing = moment(runningRound.end).diff(moment())

        io.sockets.emit('message', {
            type: 'ROUND_END_COUNTDOWN',
            data: {
                round: runningRound, 
                missing: missing
            }
        })
    }

    const runningVote = await Round.findOne({
        voting: true
    })

    if(runningVote) {
        console.log('FOUND VOTE RUNNING')

        missing = moment(runningVote.end).diff(moment())

        io.sockets.emit('message', {
            type: 'VOTE_COUNTDOWN',
            data: {
                round: runningVote, 
                missing: missing
            }
        })
    }

}

setInterval(async() => {
    await checkRounds()
}, 1000)



app.use((err, req, res, next) => {
    console.log('ERROR')
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).send(err.message)
})

server.listen(3000);