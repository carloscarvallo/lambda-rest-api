'use strict';
const connectToDatabase = require('./db')
const Note = require('./models/Note')

require('dotenv').config({ path: './vars.env' })

module.exports.create = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Note.create(JSON.parse(event.body))
                .then(note => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(note)
                }))
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Could not create the note.'
                }))
        })
}

module.exports.getOne = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Note.findById(event.pathParameters.id)
                .then(note => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(note)
                }))
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Could not fetch the note.'
                }))
        })
}

module.exports.getAll = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;
    
    connectToDatabase()
        .then(() => {
            Note.find()
                .then(note => {
                    callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(note)
                })

                })
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: {
                        'Content-Type': 'text/plain'
                    },
                    body: 'Could not fetch the notes.'
                }))
        })
}

module.exports.update = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Note.findByIdAndUpdate(event.pathParameters.id, JSON.parse(event.body), { new: true })
                .then(note => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(note)
                }))
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Could not update the note.'
                }))
        })
}

module.exports.delete = (event, context, callback) => {
    context.callbackWaitsForEmptyEventLoop = false;

    connectToDatabase()
        .then(() => {
            Note.findByIdAndRemove(event.pathParameters.id)
                .then(note => callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Removed note with id: ' + note._id, note: note })
                }))
                .catch(err => callback(null, {
                    statusCode: err.statusCode || 500,
                    headers: { 'Content-Type': 'text/plain' },
                    body: 'Could not remove the note.'
                }))
        })
}