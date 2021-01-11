//1 - DEPENDENCIES
const express = require('express')

//import { generage } from 'shortid' //ES6 modules
const generate = require('shortid').generate

//2 - INSTANTIATE AND CONFIGURE THE SERVER
const app = express() 
app.use(express.json())

//3 - DECIDE A PORT NUMBER
const PORT = 4000

//4 - FAKE DATA
let users = [
    { id: generate(), name: 'Jane Doe', bio: 'Not Tarzans Wife, another Jane' },
]

//5 - ENDPOINT
//[GET] all users in the db
app.get('/api/users', (req, res) => {
    res.status(200).json(users)
})

//[GET] user with the id passed as a parater in the URL
app.get('/api/users/:id', (req, res) => {
    const { id } = req.params
    const user = users.find(user => user.id === id)
    
    if (!user) {
        res.status(404).json({
            message: "The user with the specified ID does not exist."
        })
    } else {
        res.status(200).json(user)
    }
})

//[POST] creates a user using the infromation sent inside the 'request body'
app.post('/api/users', (req, res) => {
    const { name, bio } = req.body
    if (!name || !bio) {
        res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        })
    } else { 
        const newUser = { id: generate(), name: name, bio: bio }
        users.push(newUser)
        res.status(201).json(newUser)
    }
})

//[DELETE]
app.delete('/api/users/:id', (req, res) => {
    const { id } = req.params
    try {
        if (!users.find(user => user.id === id)) {
            res.status(404).json({ message: "The user with the specified ID does not exist."})
        } else {
            users = users.filter(user =>  user.id !== id)
            res.status(200).json({ message: `User with id ${id} got deleted!`})
        } 
    } catch (error) {
            res.status(500).json({ errorMessage: "The user could not be removed" })
    }
})


//[PUT] - updates user with specific id
app.put('/api/users/:id', (req, res) => {
    const { id } = req.params
    
    const { name, bio } = req.body

    const indexOfUser = users.findIndex(user => user.id === id)

    if (indexOfUser !== -1) {
        users[indexOfUser] = { id, name, bio }

        res.status(200).json({ id, name, bio })
    } else {
        res.status(400).json({
            errorMessage: "Please provide name and bio for the user."
        })
    }
})





app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found' })
})

app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`)
})