const express = require('express')
const cors = require('cors')

const fs = require('fs')
const dbFile = __dirname + '/db.json'

const filterById = require('./utils/filterById')
const filterByAnswerId = require('./utils/filterByAnswerId')

const app = express()

app.use(express.json())
app.use(cors())

app.get('/questions/:id?', (req, res) => {
    fs.readFile(dbFile, 'utf-8', (err, data) => {
        if (err) return console.error(err)
        let questions = JSON.parse(data).questions
        if (!questions) questions = []
        let responseData = filterById(req, questions)
        return res.status(200).send(responseData)
    })
})

app.post('/questions', (req, res) => {
    fs.readFile(dbFile, 'utf-8', (err, data) => {
        if (err) return console.error(err)
        const parsedData = JSON.parse(data)
        if (!parsedData.questions) parsedData.questions = []
        const index = parsedData.questions.length + 1
        const time = (new Date()).toLocaleString()
        const newData = {
            ...req.body,
            time,
            id: index
        }
        parsedData.questions.push(newData)
        fs.writeFile(dbFile, JSON.stringify(parsedData, null, 4), err => {
            if (err) return console.error(err)
            return res.status(200).send('Question added')
        })
    })
})

app.get('/answers/:id?', (req, res) => {
    fs.readFile(dbFile, 'utf-8', (err, data) => {
        if (err) return console.error(err)
        let answers = JSON.parse(data).answers
        if (!answers) answers = []
        let responseData = filterByAnswerId(req, answers)
        return res.status(200).send(responseData)
    })
})

app.post('/answers', (req, res) => {
    fs.readFile(dbFile, 'utf-8', (err, data) => {
        if (err) return console.error(err)
        const parsedData = JSON.parse(data)
        if (!parsedData.answers) parsedData.answers = []
        const index = parsedData.answers.length + 1
        const time = (new Date()).toLocaleString()
        const newData = {
            ...req.body,
            answered_at: time,
            id: index
        }
        parsedData.answers.push(newData)
        fs.writeFile(dbFile, JSON.stringify(parsedData, null, 4), err => {
            if (err) return console.error(err)
            return res.status(200).send('Answer added')
        })
    })
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on port ${port}`))