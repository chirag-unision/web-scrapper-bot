const express = require('express');
const cors = require('cors');

var app = express();
var port = process.env.PORT || 3100;

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.send('Hey there! This is scrapper backend.');
});

app.post('/', (req, res) => {
    res.send('Hey there! This is scrapper backend.');
});

// //Routers
const mainRoutes= require('./routes/main')

// // Apis
app.use('/api/v1/', mainRoutes);

app.use((req, res) => {
    res.status(404).send('Not found!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});