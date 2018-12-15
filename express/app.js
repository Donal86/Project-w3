'use strict'
const db = require('./DB-config')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.get('/list', async (req, res) => {
    const promise = new Promise((resolve, reject) => {
        const query = 'SELECT * FROM houses'
        db.query(query, (err, results, fields) => {
            if (!err) resolve(results)
            else reject(err)
        })
    })
    try {
        const data = await promise
        if (data.length < 1) {
            return res.status(301).json({
                message: 'houses data is empty'
            })
        } else res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({ error: error })
    }
})

app.post('/list', async (req, res) => {
    const promise = new Promise((resolve, reject) => {
        const { city, limit } = req.body
        const query = 'SELECT * FROM houses WHERE location_city=? limit ?'

        db.query(query, [city, Number(limit)], (err, results, fields) => {
            if (!err) resolve(results)
            else reject(err)
        })
    })
    try {
        const data = await promise
        if (data.length < 1) {
            return res.status(301).json({
                message: 'houses data is empty'
            })
        } else res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({ error: error })
    }
})

app.listen('8080', () => {
    console.log('listening on port 8080')
})