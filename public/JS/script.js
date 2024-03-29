// Function to display message in the table
function displayMessage(message) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = `<tr><td colspan="3">${message}</td></tr>`;
}

// Function to show spinner
function showSpinner() {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
}

// Function to hide spinner
function hideSpinner() {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'none';
}


// Event listener for input change in the search box
searchInput.addEventListener('input', function(event) {
    const query = event.target.value.trim();
    if (query !== '') {
        fetchDataAndPopulateTable(query);
    } else {
        // Clear the table if search input is empty
        clearTable();
    }
});

// Event listener for pressing Enter key
searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query !== '') {
            fetchDataAndPopulateTable(query);
        } else {
            // Clear the table if search input is empty
            clearTable();
        }
    }
});

// Function to clear the table
function clearTable() {
    // Your code to clear the table goes here
    // For simplicity, I'll just log a message for demonstration
    console.log('Clearing table...');
}

// Event listener for keyboard shortcut (CTRL/CMD + /)
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key === '/') {
        // Focus the search input
        searchInput.focus();
        event.preventDefault(); // Prevent default behavior of "/"
    }
});


// Function to populate the table with data
function populateTable(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = ''; // Clear previous data
    
    data.forEach(function (item, index) {
        const row = document.createElement('tr');
        
        // Counter column
        const counterCell = document.createElement('td');
        counterCell.textContent = index + 1;
        row.appendChild(counterCell);
        
        // Place Name column
        const placeNameCell = document.createElement('td');
        placeNameCell.textContent = item.city;
        row.appendChild(placeNameCell);
        
        // Country column with flag
        const countryCell = document.createElement('td');
        const flagImg = document.createElement('img');
        flagImg.src = `https://www.countryflagsapi.com/png/${item.countryCode.toLowerCase()}`;
        flagImg.alt = item.country;
        countryCell.appendChild(flagImg);
        countryCell.appendChild(document.createTextNode(item.country));
        row.appendChild(countryCell);
        
        tableBody.appendChild(row);
    });
}


// Function to fetch data for a specific page
function fetchPageData(pageNumber) {
    // Show spinner while fetching data
    showSpinner();

    // Make API request to fetch data for the specified page
    axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
        params: {
            countryIds: 'IN', // Example: Only fetch data for India for demonstration
            namePrefix: document.getElementById('searchInput').value,
            limit: document.getElementById('limitInput').value, // Get user-selected limit
            offset: (pageNumber - 1) * document.getElementById('limitInput').value // Calculate offset for pagination
        },
        headers: {
            'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
            'x-rapidapi-key': 'API_KEY' // Replace with your API key
        }
    })
    .then(function (response) {
        // Populate table with data for the specified page
        populateTable(response.data.data);
    })
    .catch(function (error) {
        console.error(error);
        displayMessage('Error occurred while fetching data');
    })
    .finally(function () {
        // Hide spinner after data is fetched
        hideSpinner();
    });
}



// Function to fetch data and populate the table
function fetchDataAndPopulateTable(query) {
    // Show spinner while fetching data
    showSpinner();

    // Check if the search query is null, undefined, or blank
    if (!query) {
        // Display "Start searching" message
        displayMessage('Start searching');
        // Hide spinner
        hideSpinner();
        return; // Exit function
    }

    // Make API request to fetch data
    axios.get('https://wft-geo-db.p.rapidapi.com/v1/geo/cities', {
        params: {
            countryIds: 'IN', // Example: Only fetch data for India for demonstration
            namePrefix: query,
            limit: document.getElementById('limitInput').value // Get user-selected limit
        },
        headers: {
            'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
            'x-rapidapi-key': 'API_KEY' // Replace with your API key
        }
    })
    .then(function (response) {
        if (response.data.data.length === 0) {
            // Display "No result found" message
            displayMessage('No result found');
        } else {
            // Populate table with data
            populateTable(response.data.data);

            // Calculate total number of pages based on total count and limit
            const limit = parseInt(document.getElementById('limitInput').value);
            const totalPages = Math.ceil(response.data.metadata.totalCount / limit);

            // Generate pagination buttons
            const paginationContainer = document.getElementById('paginationContainer');
            paginationContainer.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                button.addEventListener('click', function() {
                    // Handle pagination button click (e.g., fetch data for specific page)
                    fetchPageData(i);
                });
                paginationContainer.appendChild(button);
            }

            // Show pagination container
            paginationContainer.style.display = 'block';
        }
    })
    .catch(function (error) {
        console.error(error);
        displayMessage('Error occurred while fetching data');
    })
    .finally(function () {
        // Hide spinner after data is fetched
        hideSpinner();
    });
}

// //function to updatet he pagination number
// function updatePagination(data){

// }




// Function to update pagination based on total number of results
// function updatePagination(totalCount) {
//     const paginationContainer = document.getElementById('paginationContainer');
    
//     // Hide pagination if no results found
//     if (totalCount === 0) {
//         paginationContainer.style.display = 'none';
//         return;
//     }

//     // Calculate total number of pages based on total count and limit
//     const limit = parseInt(document.getElementById('limitInput').value);
//     const totalPages = Math.ceil(totalCount / limit);

//     // Generate pagination buttons
//     paginationContainer.innerHTML = '';
//     for (let i = 1; i <= totalPages; i++) {
//         const button = document.createElement('button');
//         button.textContent = i;
//         button.addEventListener('click', function() {
//             // Handle pagination button click (e.g., fetch data for specific page)
//             fetchPageData(i);
//         });
//         paginationContainer.appendChild(button);
//     }

//     // Show pagination container
//     paginationContainer.style.display = 'block';
// }

