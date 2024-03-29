require('dotenv').config()
const express = require('express');
const app = express();
const path = require('path');

const axios = require("axios").default;

// Set up middleware to parse incoming request bodies
app.use(express.urlencoded({ extended: true }));

//middleware to set the views directory so that express knows where to find the .ejs template in the views directory
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname, 'public')));

//// Set EJS as the view engine
app.set('view engine', 'ejs');



app.get('/', (req, res) => {
    // Sample data for demonstration
    // const data = [
    //     { name: 'City1', countryCode: 'US' },
    //     { name: 'City2', countryCode: 'UK' },
    //     // Add more data as needed
    // ];
    // Set paginationVisible based on your logic
    const paginationVisible = true;
    res.render('index', { data: [],paginationVisible: paginationVisible ,message: 'Start searching'});
});


app.get('/search', async (req, res) => {
    const query = req.query.q;
    const limit = req.query.limit;
    console.log(query,limit);
    
    // Check if the search query is null, undefined, or blank
    if (!query) {
        // Display "Start searching" message
        return res.render('index', { message: 'Start searching' });
    }

    try {
        // Define Axios request options
        const options = {
            method: 'GET',
            url: process.env.API_URL,
            params: {
                countryIds: 'IN',
                namePrefix: query,
                limit: limit // Use the limit parameter from the client request
            },
            headers: {
                'x-rapidapi-host': process.env.API_HOST,
                'x-rapidapi-key': process.env.API_KEY // Replace with your API key
            }
        };

        // Make the Axios request
        const response = await axios.request(options);
        // Check if there's data in the response
        if (response.data.data.length === 0) {
            // Display "No result found" message
            return res.render('index', { message: 'No result found' });
        } else {
            // Render the index.ejs template with the fetched data
            const paginationVisible = true;
            return res.render('index', { data: response.data.data ,paginationVisible: paginationVisible});
        }
    } catch (error) {
        console.error(error);
        // Handle errors
        return res.status(500).json({ error: 'Internal server error' });
    }
});



// Start the server
app.listen(process.env.PORT, () => {
    console.log('Server is running on port 3000');
});
