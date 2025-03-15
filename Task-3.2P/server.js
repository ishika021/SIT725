const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 4000;

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/register', (req, res) => {
    console.log("Form Data Received:", req.body);
    res.send("Registration Successful!");
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
