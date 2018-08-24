require('dotenv').config();
const _ = require('lodash');
const express = require('express');
const cors = require('cors');
const aws = require('aws-sdk');
const bodyParser = require('body-parser');
const moment = require('moment-timezone');
const fs = require('fs');
const sharp = require('sharp');
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

const DOMAIN = 'http://admin.codeinthedark.interlogica.it:3000';


app.use(bodyParser.json());


const {Player, Round, Vote, Event, User, Feedback} = require('./db');

app.get('/', wrap(async (req, res) => {
    res.send('WELCOME')
}));

app.post('/user', wrap(async (req, res) => {


    const user = {
        uuid: req.body.uuid,
        data: req.body
    };

    console.log(user)

    const u = new User(user);
    await u.save();

    res.status(200);
    res.json({
        message: 'user created'
    });
    res.end()

}));

app.post('/feedback', wrap(async (req, res) => {


    const feedback = {
        uuid: req.body.uuid,
        data: req.body
    };

    console.log(feedback)

    const f = new Feedback(feedback);
    await f.save();

    res.status(200);
    res.json({
        message: 'feedback saved'
    });
    res.end()

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
        showing_results: false,
        waiting: false
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
        showing_results: false,
        waiting: false
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
        showing_results: false,
        waiting: false
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
        showing_results: false,
        waiting: false
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
        showing_results: false,
        waiting: false
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
        showing_results: true,
        waiting: false
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
        showing_results: false,
        waiting: false
    });

    res.status(200);
    res.end();
}));

app.post('/round/waiting/:roundId', wrap(async (req, res) => {

    await Round.update({_id: req.params.roundId}, {
        voting: false,
        running: false,
        next: false,
        receiving_layouts: false,
        showing_results: false,
        waiting: true
    });

    res.status(200);
    res.end();
}));

app.post('/event/startCountDown', wrap(async(req, res) => {

    await Event.update({running_countdown: false}, {
        running_countdown: true
    });

    res.status(200);
    res.end();

}));

app.post('/event/stopCountDown', wrap(async(req, res) => {

    await Event.update({running_countdown: true}, {
        running_countdown: false
    });

    res.status(200);
    res.end();

}));

app.post('/vote/:roundId/:playerId', wrap(async (req, res) => {


    const foundVote = await Vote.find({
        round: req.params.roundId,
        uuid: req.body.uuid
    });

    if (foundVote.length !== 0) {
        res.status(500);
        res.send({
            message: 'Already voted'
        });
        res.end();
        return;
    }


    const vote = new Vote({
        vote_for: req.params.playerId,
        round: req.params.roundId,
        uuid: req.body.uuid,
        voter: req.body.voter
    });
    await vote.save();

    res.send({
        message: 'Vote OK'
    });
    res.status(200);
    res.end()

}));

app.get('/vote/:roundId/:uuid', wrap(async (req, res) => {


    const foundVote = await Vote.find({
        round: req.params.roundId,
        uuid: req.params.uuid
    });

    if (foundVote.length !== 0) {
        res.status(200);
        res.send(foundVote[0]);
        res.end();
        return;
    }

    res.status(200);
    res.send({});
    res.end();


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


const leftPadZero = val => val.toString().length === 2 ? val.toString() : '0' + val.toString();

const checkRounds = async () => {

    let missing;
    let duration;

    const countdownRunningEvent = await Event.findOne({
        running_countdown: true
    });

    if (countdownRunningEvent) {
        console.log("EVENT COUNTDOWN");

        missing = moment(countdownRunningEvent.event_start).diff(moment());
        duration = moment.duration(missing);

        io.sockets.emit('message', {
            type: 'EVENT_COUNTDOWN',
            data: {
                time: missing,
                missing: duration.months()  + 'm ' +duration.days() + 'd ' + duration.hours() + 'h ' + leftPadZero(duration.minutes()) + ':' + leftPadZero(duration.seconds())
            }
        });

        return;

    }


    const nextRound = await Round.findOne({
        next: true
    });

    if (nextRound) {
        console.log('SENDING NEXT ROUND');

        missing = moment(nextRound.start).diff(moment());
        duration = moment.duration(missing);


        const missingString = duration > 0 ? leftPadZero(duration.minutes()) + ':' + leftPadZero(duration.seconds()) : '00:00'

        io.sockets.emit('message', {
            type: 'ROUND_COUNTDOWN',
            data: {
                round: nextRound._id,
                time: Math.floor(duration.as('seconds')),
                missing: missingString
            }
        });

        return;
    }

    const runningRound = await Round.findOne({
        running: true
    });

    if(runningRound) {
        console.log('SENDING RUNNING ROUND');

        const maxTimer = 65;

        missing = moment(runningRound.end).diff(moment());
        duration = moment.duration(missing);
        let roundLength = moment(runningRound.end).diff(moment(runningRound.start));
        let roundDuration = moment.duration(roundLength);

        let timer = Math.ceil(duration / (roundDuration / maxTimer));

        const missingString = duration > 0 ? leftPadZero(duration.minutes()) + ':' + leftPadZero(duration.seconds()) : '00:00'

        io.sockets.emit('message', {
            type: 'ROUND_END_COUNTDOWN',
            data: {
                round: runningRound._id,
                time: Math.floor(duration.as('seconds')),
                missing: missingString,
                countdownStep: timer <= maxTimer ? timer : maxTimer
            }
        });

        return;
    }

    const runningVote = await Round.findOne({
        voting: true
    });

    if(runningVote) {
        console.log('SENDING VOTE RUNNING');

        missing = moment(runningVote.vote_end).diff(moment());
        duration = moment.duration(missing);

        const missingString = duration > 0 ? leftPadZero(duration.minutes()) + ':' + leftPadZero(duration.seconds()) : '00:00'

        io.sockets.emit('message', {
            type: 'VOTE_COUNTDOWN',
            data: {
                round: runningVote._id,
                time: Math.floor(duration.as('seconds')),
                missing: missingString
            }
        });

        return;
    }

    const showingResultsRound = await Round.findOne({
        showing_results: true
    });

    if(showingResultsRound) {
        console.log('SENDING ROUND SHOWING RESULTS');

        io.sockets.emit('message', {
            type: 'SHOWING_RESULTS',
            data: {
                round: showingResultsRound._id
            }
        });

        return;
    }

    const receivingLayoutsRound = await Round.findOne({
        receiving_layouts: true
    });

    if(receivingLayoutsRound ) {
        console.log('SENDING RECEIVING LAYOUTS ROUND');

        io.sockets.emit('message', {
            type: 'RECEIVING_RESULTS',
            data: {
                missing: "00:00",
                time: 0,
                round: receivingLayoutsRound._id
            }
        });

    }

    const waitingRound = await Round.findOne({
        waiting: true
    });

    if(waitingRound ) {
        console.log('SENDING WAITING ROUND');

        io.sockets.emit('message', {
            type: 'WAITING',
            data: {
                round: waitingRound._id
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


app.post('/round', wrap(async (req, res) => {

    const players = await Player.find({
        '_id': { $in : _.compact(req.body.players) }
    });

    const roundStart = moment(req.body.start)
        .set('H', req.body.start_hour)
        .set('m', req.body.start_minute)
        .utc();

    const roundEnd = moment(req.body.end)
        .set('H', req.body.end_hour)
        .set('m', req.body.end_minute)
        .utc();

    const voteStart = moment(req.body.vote_start)
        .set('H', req.body.vote_start_hour)
        .set('m', req.body.vote_start_minute)
        .utc();

    const voteEnd = moment(req.body.vote_end)
        .set('H', req.body.vote_end_hour)
        .set('m', req.body.vote_end_minute)
        .utc();

    const round = {
        name: req.body.name,
        layout_url: req.body.layout_url,
        players: players,

        running: false,
        next: false,
        voting: false,
        showing_results: false,
        receiving_layouts: false,
        last: req.body.last,

        start: roundStart,
        end: roundEnd,
        vote_start: voteStart,
        vote_end: voteEnd
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
        register: {
            page: '/content/register.html',
            endpoint: '/user'
        },
        feedback: {
            page: '/content/feedback.html',
            endpoint: '/feedback'
        },
        navigation: [
            {
                label: 'About Us',
                icon: '/assets/icons/icon_aboutus.png',
                url:  '/content/about.html'
            },
            {
                label: 'Location',
                icon: '/assets/icons/icon_location.png',
                url:  '/content/location.html'
            },
            {
                label: 'Gallery Round',
                icon: '/assets/icons/icon_gallery.png',
                url: '/content/gallery.html'
            },
            {
                label: 'Sponsor',
                icon: '/assets/icons/icon_sponsor.png',
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

    const width = 1920;
    const height = 1080;

    try {
        fs.writeFileSync(fileName, req.body.html);

        const browser = await puppeteer.launch({
            headless: true,
            args: [
                `--window-size=${ width },${ height }`
            ]
        });
        const page = await browser.newPage();
        page.setViewport({ width, height });

        const previewUrl = '/layouts/' + round[0]._id + '/' + req.body.player + '.html';
        const fullPreviewUrlPng = '/layouts/' + round[0]._id + '/' + req.body.player + '.png';
        const previewUrlPng = '/layouts/' + round[0]._id + '/' + req.body.player + '_small.png';


        await page.goto('http://localhost:3000' + previewUrl);
        await page.screenshot({
            path: dirName + '/' + req.body.player + '.png',
            clip: {
                x: 0,
                y: 0,
                width,
                height
            }
        });

        await sharp(dirName + '/' + req.body.player + '.png')
            .resize(width /2, height / 2)
            .toFile(dirName + '/' + req.body.player + '_small.png');

        await browser.close();

        const players = _.cloneDeep(round[0].players);
        const player = players.find(p => p.name === req.body.player);
        player.full_preview_url = DOMAIN + fullPreviewUrlPng;
        player.preview_url = DOMAIN + previewUrlPng;

        await Round.findByIdAndUpdate(round[0]._id, {
            $set: {
                players: players
            }
        })


    } catch(err) {
        console.error(err);
        res.status(500);
        res.send(err);
        res.end();
    }

    res.status(200);
    res.end()
}));

server.listen(3000);