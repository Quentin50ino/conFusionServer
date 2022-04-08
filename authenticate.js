const passport = require('passport')
var passoport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var User = require('./models/user')
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

var config = require('./config.js');

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey,
        {expiresIn: 3600}); //valore che infica quanto tempo vive questo web token
};

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken(); //metodo che estrae il web token
opts.secretOrKey = config.secretKey; //assegno la chiave segreta (scritta nel file config.js)

exports.jwtPassport = passport.use(new JwtStrategy(opts, //creo una nuova jwt strategy
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload); //stampo a console il payload del web token
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if (err) {
                return done(err, false); //se c'è un errore chiamo la funzione done (che è una callback che abbiamo passato alla JwtStrategy)
            }
            else if (user) {
                return done(null, user); //se non c'è un errore (quindi user!=null) chiamo la funzione done, passandogli err = null
            }
            else {
                return done(null, false);
            }
        });
    }));

exports.verifyUser = passport.authenticate('jwt', {session: false}); //specifico che NON vogliamo creare una sessione al login dell'utente
//questo perchè al posto della sessione vogliamo usare il web token, che è più scalabile 

exports.local = passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())