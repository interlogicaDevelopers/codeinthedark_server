require('dotenv').config();
const _ = require('lodash');
const express = require('express');
const cors = require('cors');
const aws = require('aws-sdk');
const bodyParser = require('body-parser');
const moment = require('moment');
const fs = require('fs');

const puppeteer = require('puppeteer');

let multer = require('multer');
let formData = multer();

// const auth = require('http-auth');

// const basic = auth.basic({
//     realm:"MyRealm",
//     file: __dirname + "/data/sec"
// });

const app = express();
app.use(cors());
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const wrap = require('async-middleware').wrap;


app.use(bodyParser.json()); 



const {Player, Round, Vote} = require('./db');

app.get('/', wrap(async (req, res) => {
    res.send('WELCOME')
}));

app.get('/round', wrap(async (req, res) => {

    const rounds = await Round.find();
    res.json(rounds)
    
}));

app.get('/round/:id', wrap(async (req, res) => {

    const round = await Round.findById(req.params.id);
    res.json(round)

}));

app.post('/round/start/:roundId', wrap(async (req, res) => {
    await Round.update({_id: req.params.roundId}, {
        voting: false,
        running: true,
        next: false,
        receiving_layouts: false,
        showing_results: false
    });

    res.status(200);
    res.end();

}));

app.post('/round/next/:roundId', wrap(async (req, res) => {
    await Round.update({_id: req.params.roundId}, {
        voting: false,
        running: false,
        next: true,
        receiving_layouts: false,
        showing_results: false
    });

    res.status(200);
    res.end();

}));

app.post('/round/stop/:roundId', wrap(async (req, res) => {
    await Round.update({_id: req.params.roundId}, {
        voting: false,
        running: false,
        next: false,
        receiving_layouts: false,
        showing_results: false
    });

    res.status(200);
    res.end();
}));

app.post('/round/archive/:roundId', wrap(async (req, res) => {
    await Round.update({_id: req.params.roundId}, {
        voting: false,
        running: false,
        next: false,
        receiving_layouts: false,
        showing_results: false
    });

    res.status(200);
    res.end();
}));

app.post('/round/startVote/:roundId', wrap(async (req, res) => {
    await Round.update({_id: req.params.roundId}, {
        voting: true,
        running: false,
        next: false,
        receiving_layouts: false,
        showing_results: false
    });

    res.status(200);
    res.end();
}));

app.post('/round/showResults/:roundId', wrap(async (req, res) => {

    await Round.update({_id: req.params.roundId}, {
        voting: false,
        running: false,
        next: false,
        receiving_layouts: false,
        showing_results: true
    });

    res.status(200);
    res.end();
}));

app.post('/round/receiveLayouts/:roundId', wrap(async (req, res) => {

    await Round.update({_id: req.params.roundId}, {
        voting: false,
        running: false,
        next: false,
        receiving_layouts: true,
        showing_results: false
    });

    res.status(200);
    res.end();
}));




app.post('/vote/:roundId/:playerId', wrap(async (req, res) => {

    const vote = new Vote({
        vote_for: req.params.playerId,
        round: req.params.roundId,
        voter: req.body
    });
    await vote.save();

    res.send(200);
    
}));

app.get('/vote/:roundId', wrap(async (req, res) => {

    const votes = await Vote.find({
        round: req.params.roundId
    });
    const round = await Round.findById(req.params.roundId);
    console.log({round});
    const players = round.players;

    console.log({players});

    const groupedVotes = _.groupBy(votes, vote => vote.vote_for);


    const g = players.map(player => {
        return {
            id: player._id,
            name: player.name,
            votes: groupedVotes[player._id] ? groupedVotes[player._id].length : 0,
            preview_url: ''
        };
    });

    const results = _.sortBy(g, v => v.votes).reverse();

    res.json(results)
}));


io.on('connection', (socket) => {
    console.log('CONNECTION', socket.id)
});


const checkRounds = async () => {

    const nextRound = await Round.findOne({
        next: true
    });

    let missing;
    let duration;

    if (nextRound) {
        console.log('FOUND NEXT ROUND');

        missing = moment(nextRound.start).diff(moment());
        duration = moment.duration(missing);

        io.sockets.emit('message', {
            type: 'ROUND_COUNTDOWN',
            data: {
                round: nextRound, 
                time: missing,
                missing: duration.minutes() + ':' + duration.seconds()
            }
        });

        return;
    }

    const runningRound = await Round.findOne({
        running: true
    });

    if(runningRound) {
        console.log('FOUND RUNNING ROUND');

        missing = moment(runningRound.end).diff(moment());
        duration = moment.duration(missing);

        io.sockets.emit('message', {
            type: 'ROUND_END_COUNTDOWN',
            data: {
                round: runningRound, 
                time: missing,
                missing: duration.minutes() + ':' + duration.seconds()
            }
        });

        return;
    }

    const runningVote = await Round.findOne({
        voting: true
    });

    if(runningVote) {
        console.log('FOUND VOTE RUNNING');

        missing = moment(runningVote.end).diff(moment());
        duration = moment.duration(missing);

        io.sockets.emit('message', {
            type: 'VOTE_COUNTDOWN',
            data: {
                round: runningVote, 
                time: missing,
                missing: duration.minutes() + ':' + duration.seconds()
            }
        });

        return;
    }

    const showingResultsRound = await Round.findOne({
        showing_results: true
    });

    if(showingResultsRound) {
        console.log('FOUND ROUND SHOWING RESULTS');

        io.sockets.emit('message', {
            type: 'SHOWING_RESULTS',
            data: {
                round: showingResultsRound
            }
        });

        return;
    }

    const receivingLayoutsRound = await Round.findOne({
        receiving_layouts: true
    });

    if(receivingLayoutsRound ) {
        console.log('FOUND RECEIVING LAYOUTS ROUND');

        io.sockets.emit('message', {
            type: 'RECEIVING_RESULTS',
            data: {
                round: receivingLayoutsRound
            }
        });

    }

};


setInterval(async() => {
    await checkRounds()
}, 1000);


app.use((err, req, res, next) => {
    console.log('ERROR');
    if (res.headersSent) {
        return next(err)
    }
    res.status(500).send(err.message)
});


app.use(express.static('public'));

// DASHBOARD

// app.use(auth.connect(basic));
app.set('view engine', 'pug');

app.get('/admin', wrap(async (req, res) => {

    const rounds = await Round.find();
    const players = await Player.find();

    res.render('index', {
        title: 'Admin DASHBOARD',
        rounds,
        players
    })

}));

app.get('/round-form', wrap(async (req, res) => {

    const players = await Player.find();

    console.log(players);

    res.render('round-form', {
        title: 'Create Round',
        players
    })

}));


app.post('/create-round', wrap(async (req, res) => {

    const players = await Player.find({
        '_id': { $in : _.compact(req.body.players) }
    });

    const round = {
        name: req.body.name,
        layout_url: req.body.layout_url,
        players: players,

        running: false,
        next: false,
        voting: false,
        showing_results: false,

        start: req.body.start,
        end: req.body.end,
        vote_start: req.body.vote_start,
        vote_end: req.body.vote_end,
    };

    console.log({round});

    const r = new Round(round);
    await r.save();

    res.status(200);
    res.end('Round created');

}));

app.get('/player-form', wrap(async (req, res) => {

    res.render('player-form', {
        title: 'Create Player'
    })

}));

app.post('/create-player', wrap(async (req, res) => {

    const player = {
        name: req.body.name
    };

    console.log({player});

    const p = new Player(player);
    await p.save();

    res.status(200);
    res.end('Player created');

}));


app.delete('/round/:roundId', wrap(async (req, res) => {

    await Round.deleteOne({_id: req.params.roundId});

    res.status(200);
    res.end('Round deleted');

}));

app.delete('/player/:playerId', wrap(async (req, res) => {

    await Player.deleteOne({_id: req.params.playerId});

    res.status(200);
    res.end('Player deleted');

}));


app.get('/config', wrap(async (req, res) => {

    const config = {
        stage: 'dev',
        navigation: [
            {
                label: 'About Us',
                icon: 'about-icon.png',
                url:  '/content/about.html'
            },
            {
                label: 'Location',
                icon: 'location-icon.png',
                url:  '/content/location.html'
            },
            {
                label: 'Gallery Round',
                icon: 'gallery-icon.png',
                url: '/content/gallery.html'
            },
            {
                label: 'Sponsor',
                icon: 'sponsor-icon.png',
                url: '/content/sponsor.html'
            }
        ]
    };

    res.status(200);
    res.json(config);


}));

app.post('/get-layout', wrap(async (req, res) => {

    const round = await Round.find({
        receiving_layouts: true
    });

    console.log({round});

    if (round.length === 0) {
        res.status(500);
        res.end("No round receiving");
        return;
    }

    console.log(req.body.player);
    console.log(req.body.html);

    const dirName = __dirname + '/public/layouts/' + round[0]._id;

    if (!fs.existsSync(dirName)) {
        console.log('create dir', dirName);
        fs.mkdirSync(dirName);
    }

    const fileName = dirName + '/' + req.body.player + '.html';
    fs.writeFileSync(fileName, req.body.html);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const previewUrl = '/layouts/' + round[0]._id + '/' + req.body.player + '.html';

    await page.goto('http://localhost:3000' + previewUrl);
    await page.screenshot({
        path: dirName + '/' + req.body.player + '.png',
        clip: {
            x: 0,
            y: 0,
            width: 1920,
            height: 1080
        }
    });

    await browser.close();

    res.status(200);
    res.end()
}));

server.listen(3000);