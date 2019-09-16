const mongoose = require('mongoose');


const db = mongoose.connection;

db.on('error', (error) => {
    console.error("CONNECTION ERROR!");
    console.error(error);
    setTimeout(() => {
        startConnection();
    }, 5000);
});
db.once('open', function() {
  // we're connected!
  console.log('connected to mongo')
});


const playerSchema = new mongoose.Schema({
    fullname: 'string',
    name: 'string'
});

const Player = mongoose.model('Player', playerSchema);

const roundSchema = new mongoose.Schema({
    name: String,
    layout_url: 'string',
    players: [mongoose.Schema.Types.Mixed],
    next: Boolean,
    running: Boolean,
    voting: Boolean,
    showing_results: Boolean,
    receiving_layouts: Boolean,
    start: Date,
    end: Date,
    vote_start: Date,
    vote_end: Date,
    last: Boolean,
    waiting: Boolean,
    instructions_url: String
});

const Round = mongoose.model('Round', roundSchema);


const voteSchema = new mongoose.Schema({
    vote_for: mongoose.Schema.Types.ObjectId,
    round: mongoose.Schema.Types.ObjectId,
    voter: mongoose.Schema.Types.Mixed,
    uuid: String
});

const Vote = mongoose.model('Vote', voteSchema);

const eventSchema = new mongoose.Schema({
    event_start: Date,
    running_countdown: Boolean,
    event_name: String
});

const Event = mongoose.model('Event', eventSchema);



const userSchema = new mongoose.Schema({
    uuid: String,
    data: mongoose.Schema.Types.Mixed
});

const User = mongoose.model('User', userSchema);


const feedbackSchema = new mongoose.Schema({
    uuid: String,
    data: mongoose.Schema.Types.Mixed
});

const Feedback = mongoose.model('Feedback', feedbackSchema);

const connString = 'mongodb://' + process.env.MONGOUSER + ':' + process.env.MONGOPSW +
                    '@' + process.env.MONGOHOST + ':' + (process.env.MONGOPORT || 27017) +
                    '/' + process.env.MONGODB;

function startConnection() {
    mongoose.connect(connString)
        .then(() => {
            console.log("Connected to Database");
        }).catch((err) => {
        console.log("Not Connected to Database ERROR! ", err);
    });
}

startConnection();

module.exports = {
    Player,
    Round,
    Vote,
    Event,
    User,
    Feedback
};


