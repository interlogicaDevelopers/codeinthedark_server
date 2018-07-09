const mongoose = require('mongoose');


const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log('connected to mongo')
});


const playerSchema = new mongoose.Schema({
    name: 'string'
}) 

const Player = mongoose.model('Player', playerSchema);


const roundSchema = new mongoose.Schema({
    name: String,
    layout_url: 'string',
    players: [mongoose.Schema.Types.Mixed],
    next: Boolean,
    running: Boolean,
    voting: Boolean,
    showing_results: Boolean,
    start: Date,
    end: Date,
    vote_start: Date,
    vote_end: Date
})

const Round = mongoose.model('Round', roundSchema);


const voteSchema = new mongoose.Schema({
    vote_for: mongoose.Schema.Types.ObjectId,
    round: mongoose.Schema.Types.ObjectId,
    voter: mongoose.Schema.Types.Mixed
})

const Vote = mongoose.model('Vote', roundSchema);

mongoose.connect('mongodb://' + process.env.MONGOUSER + ':' + process.env.MONGOPSW + '@' + process.env.MONGOHOST, {
    dbName: 'citd'
});

module.exports = {
    Player,
    Round,
    Vote
}


