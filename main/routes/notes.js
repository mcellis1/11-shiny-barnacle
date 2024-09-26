const notes = require('express').Router()
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils')
const uuid = require('../helpers/uuid')

notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
})

notes.post('/', (req, res) => {
    const { title, text } = req.body
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuid(),
        }
        readAndAppend(newNote, './db/db.json')
        res.json(`new note added`)
        const response = {
            status: 'success',
            body: newNote,
        }
        res.json(response)
    } else {
        res.errored('error adding note')
    }
})

notes.delete('/:id', (req, res) => {
    const noteId = req.params.id;
    readFromFile('./db/db.json')
      .then((data) => JSON.parse(data))
      .then((json) => {
        const result = json.filter((note) => note.id !== noteId);
          writeToFile('./db/db.json', result);
          res.json(`Item ${noteId} has been deleted 🗑️`)
      })  
})

module.exports = notes
