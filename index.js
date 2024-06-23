const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.json());

const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath);
        return JSON.parse(data);
    } catch (err) {
        console.error(`Error reading file from disk: ${err}`);
        return [];
    }
}

const writeJsonFile = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error(`Error writing file to disk: ${err}`);
    }
}

app.post('/users', (req, res) => {
    const { name, email, password } = req.body;
    try {
        let users = readJsonFile('users.json');
        const maxId = users.length > 0 ? Math.max(...users.map(user => user.id)) : 0;
        const newUser = { id: maxId + 1, name, email, password };
        users.push(newUser);
        writeJsonFile('users.json', users);
        res.status(200).send(newUser);
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

app.get('/users', (req, res) => {
    try {
        let users = readJsonFile('users.json');
        res.status(200).send(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

app.get('/users/:id', (req, res) => {
    try {
        let users = readJsonFile('users.json');
        const user = users.find(elm => elm.id == +req.params.id);
        res.status(200).send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

app.put('/users/:id', (req, res) => {
    const { name, email, password } = req.body;
    try {
        let users = readJsonFile('users.json');
        const updatedUsers = users.map(user =>
            user.id == req.params.id ? { ...user, name, email, password } : user
        );
        writeJsonFile('users.json', updatedUsers);
        res.status(200).send(updatedUsers.find(user => user.id == req.params.id));
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

app.delete('/users/:id', (req, res) => {
    try {
        let users = readJsonFile('users.json');
        const userToDelete = users.find(user => user.id == req.params.id);
        const updatedUsers = users.filter(user => user.id != req.params.id);
        writeJsonFile('users.json', updatedUsers);
        if (userToDelete) {
            res.status(200).send(userToDelete);
        } else {
            res.status(404).send('User not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

// User profile routes
app.post('/users/:id/profile', (req, res) => {
    const { bio, profilePictureUrl } = req.body;
    const userId = +req.params.id;
    try {
        let profiles = readJsonFile('profiles.json');
        const newProfile = { userId, bio, profilePictureUrl };
        profiles.push(newProfile);
        writeJsonFile('profiles.json', profiles);
        res.status(200).send(newProfile);
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

app.get('/users/:id/profile', (req, res) => {
    const userId = +req.params.id;
    try {
        let profiles = readJsonFile('profiles.json');
        const profile = profiles.find(p => p.userId === userId);
        if (profile) {
            res.status(200).send(profile);
        } else {
            res.status(404).send('Profile not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

app.put('/users/:id/profile', (req, res) => {
    const { bio, profilePictureUrl } = req.body;
    const userId = +req.params.id;
    try {
        let profiles = readJsonFile('profiles.json');
        const updatedProfiles = profiles.map(profile =>
            profile.userId === userId ? { ...profile, bio, profilePictureUrl } : profile
        );
        writeJsonFile('profiles.json', updatedProfiles);
        res.status(200).send(updatedProfiles.find(profile => profile.userId === userId));
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

app.delete('/users/:id/profile', (req, res) => {
    const userId = +req.params.id;
    try {
        let profiles = readJsonFile('profiles.json');
        const profileToDelete = profiles.find(profile => profile.userId === userId);
        const updatedProfiles = profiles.filter(profile => profile.userId !== userId);
        writeJsonFile('profiles.json', updatedProfiles);
        if (profileToDelete) {
            res.status(200).send(profileToDelete);
        } else {
            res.status(404).send('Profile not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Something went wrong');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
