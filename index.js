const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.json());

app.post('/users', (req, res) => {

    console.log(req.body)
    const { name, email, password } = req.body;

    try {
        let allUsers = fs.readFileSync('users.json');

        let users = JSON.parse(allUsers);
        const maxId = users.length > 0 ? Math.max(...users.map(user => user.id)) : 0;

        const newUser = { id: maxId + 1, name, email, password };
        users.push(newUser);

        fs.writeFileSync('users.json', JSON.stringify(users));

        res.status(200).send(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

app.get('/users', (req,res)=>{

    try {
        let allUsers = fs.readFileSync('users.json');
        let users = JSON.parse(allUsers);

        res.status(200).send(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
})

app.get('/users/:id', (req,res)=>{

    try {
        let allUsers = fs.readFileSync('users.json');
        let users = JSON.parse(allUsers);

        const user = users.find(elm=> elm.id == +req.params.id)

        res.status(200).send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
})

app.put('/users/:id', (req, res)=>{

    console.log(req.body)
    const { name, email, password } = req.body;

    try {
        let allUsers = fs.readFileSync('users.json');
        let users = JSON.parse(allUsers);

        const updatedUsers = users.map(user =>
            user.id == req.params.id ? { ...user, name, email, password } : user
        );

        fs.writeFileSync('users.json', JSON.stringify(updatedUsers));

        res.status(200).send(updatedUsers.find(user => user.id == req.params.id));
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
})

app.delete('/users/:id', (req, res)=>{

    try {
        let allUsers = fs.readFileSync('users.json');
        let users = JSON.parse(allUsers);

        const userToDelete = users.find(user => user.id == req.params.id);

        const updatedUsers = users.filter(user => user.id != req.params.id);

        fs.writeFileSync('users.json', JSON.stringify(updatedUsers));

        if (userToDelete) {
            res.status(200).send(userToDelete);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
})


// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
