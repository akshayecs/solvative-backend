require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');

const axios = require("axios").default;

// Set up middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

//middleware to set the views directory
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, 'public')));

//// Set EJS as the view engine
app.set('view engine', 'ejs');



app.get('/', (req, res) => {
    // Sample data
    // const data = [
    //     { name: 'City1', countryCode: 'US' },
    //     { name: 'City2', countryCode: 'UK' },
    //     // Add more data as needed
    // ];
    const paginationVisible = true;
    const searchInteraction = false;
    res.render('index', { data: [],paginationVisible: paginationVisible,searchInteraction:searchInteraction ,message: 'Start searching'});
});


app.get('/search', async (req, res) => {
    const query = req.query.q;
    const limit = req.query.limit;

    
    if (!query) {
        return res.render('index', { message: 'Start searching' });
    }

    try {
        const options = {
            method: 'GET',
            url: process.env.API_URL,
            params: {
                countryIds: 'IN',
                namePrefix: query,
                limit: limit
            },
            headers: {
                'x-rapidapi-host': process.env.API_HOST,
                'x-rapidapi-key': process.env.API_KEY 
            }
        };

        // Make the Axios request
        const response = await axios.request(options);
        if (response.status === 200) {
            if (response.data && response.data.data && response.data.data.length > 0) {
                const paginationVisible = true;
                return res.json({ data: response.data.data, paginationVisible });
            } else {
                const paginationVisible = true;
                return res.json({ data: response.data.data, paginationVisible, message: 'No Data Found' });
            }
        } else {
                        return res.status(500).json({ error: 'Internal server error' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});




// Start the server
app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');
});
