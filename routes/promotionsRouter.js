const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Promotions = require('../models/promotions')

const promotionRouter = express.Router();
promotionRouter.use(bodyParser.json())

const promotionsRouter = express.Router();
promotionsRouter.use(bodyParser.json())

promotionsRouter.route('/')
/*.all((req, res, next) => {
    //viene eseguito per tutte le possibili richieste (GET, POST, PUT, DELETE) con il path /promotions
    res.statusCode = 200;
    res.setHeader('ContentType','text/plain');
    next();
})*/
.get((req, res, next) => {
    //res.end('Will send all the promotions to you!')
    Promotions.find({}).then((promotions) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promotions)
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post((req, res, next) => {
    //res.end('Will add the promotion: ' + req.body.name + ' with details: ' + req.body.description)
    Promotions.create(req.body).then((promo) => {
        console.log('Promotion created', promo)
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promo)
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put((req, res, next) => {
    res.statusCode = 403 //operazione non supportata (method not allowed)
    res.end('PUT operation not supported on /promotions')
}).delete((req, res, next) => {
    //res.end('Deleting all the promotions')
    Promotions.remove({}).then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, (err) => next(err))
    .catch((err) => next(err))
})

//with params :promotionId
promotionsRouter.route('/:promotionId')
.get((req, res, next) => {
    //res.end('Will send details of the promotion: ' + req.params.promotionId + ' to you!')
    Promotions.findById(req.params.promotionId).then((promo) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promo)
    }, (err) => next(err))
    .catch((err) => next(err))
})

.post((req, res, next) => {
    res.statusCode = 403 //operazione non supportata (method not allowed)
    res.end('POST operation not supported on /promotions/' + req.params.promotionId)
})

.put((req, res, next) => {
    //res.write('Updating the promotion: ' + req.params.promotionId)
    //res.end('Will update the promotion: ' + req.body.name + ' with details: ' + req.body.description)
    Promotions.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, {new: true}).then((promo) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(promo)
    }, (err) => next(err))
    .catch((err) => next(err))
})
.delete((req, res, next) => {
    //res.end('Deleting promotion: ' +  req.params.promotionId)
    Promotions.findByIdAndRemove(req.params.promotionId).then((resp) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(resp)
    }, (err) => next(err))
    .catch((err) => next(err))
})

module.exports = promotionsRouter;