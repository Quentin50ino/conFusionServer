const express = require('express');
const bodyParser = require('body-parser')

const promotionsRouter = express.Router();
promotionsRouter.use(bodyParser.json())

promotionsRouter.route('/')
.all((req, res, next) => {
    //viene eseguito per tutte le possibili richieste (GET, POST, PUT, DELETE) con il path /promotions
    res.statusCode = 200;
    res.setHeader('ContentType','text/plain');
    next();
})
.get((req, res, next) => {
    res.end('Will send all the promotions to you!')
})
.post((req, res, next) => {
    res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description)
})
.put((req, res, next) => {
    res.statusCode = 403 //operazione non supportata (method not allowed)
    res.end('PUT operation not supported on /promotions')
}).delete((req, res, next) => {
    res.end('Deleting all the promotions')
})

//with params :promotionId
promotionsRouter.route('/:promotionId')
.get((req, res, next) => {
    res.end('Will send details of the promotion: ' + req.params.promotionId + ' to you!')
})

.post((req, res, next) => {
    res.statusCode = 403 //operazione non supportata (method not allowed)
    res.end('POST operation not supported on /promotions/' + req.params.promotionId)
})

.put((req, res, next) => {
    res.write('Updating the promotion: ' + req.params.promotionId)
    res.end('Will update the promotion: ' + req.body.name + ' with details: ' + req.body.description)
})
.delete((req, res, next) => {
    res.end('Deleting promotion: ' +  req.params.promotionId)
})

module.exports = promotionsRouter;