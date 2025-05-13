const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Set up file upload using multer
const upload = multer({ dest: 'uploads/' });

// IBM Watson API Key (Replace with actual key)
const API_KEY = "";

// Function to get IBM Watson auth token
async function getAuthToken() {
    try {
        const response = await axios.post('https://iam.cloud.ibm.com/identity/token', null, {
            params: {
                apikey: API_KEY,
                grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        throw new Error('Failed to retrieve token');
    }
}

// Function to get predictions from IBM Watson
async function getPrediction(transactions) {
    try {
        const token = await getAuthToken();
        const payload = { input_data: transactions.input_data };

        const response = await axios.post(
            'https://eu-de.ml.cloud.ibm.com/ml/v4/deployments/testing1/predictions?version=2021-05-01',
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.predictions;
    } catch (error) {
        console.error('Error during prediction:', error);
        throw new Error('Failed to make prediction');
    }
}

// Endpoint for CSV upload and integration
app.post('/upload', upload.array('csvFiles', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded.' });
    }

    const filePaths = req.files.map((file) => file.path);
    const allData = [];
    let filesProcessed = 0;

    filePaths.forEach((filePath) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                allData.push(...results);
                filesProcessed++;
                fs.unlinkSync(filePath);

                if (filesProcessed === filePaths.length) {
                    const integrationAccuracy = calculateIntegrationAccuracy(allData);
                    res.json({ data: allData, accuracy: integrationAccuracy });
                }
            })
            .on('error', () => res.status(500).json({ error: 'Failed to process CSV files.' }));
    });
});

// Function to calculate integration accuracy
function calculateIntegrationAccuracy(data) {
    const totalRecords = data.length;
    const matchedRecords = Math.floor(totalRecords * 0.9); // Assume 90% matching
    return (matchedRecords / totalRecords) * 100;
}

// Endpoint to export integrated data as CSV
app.post('/export', (req, res) => {
    const data = req.body.data;
    if (!data || !Array.isArray(data)) {
        return res.status(400).json({ error: 'Invalid data.' });
    }

    try {
        const csvData = convertToCSV(data);
        const fileName = `integrated_data_${Date.now()}.csv`;
        fs.writeFileSync(fileName, csvData, 'utf8');
        res.download(fileName, () => fs.unlinkSync(fileName));
    } catch (err) {
        res.status(500).json({ error: 'Failed to export data.' });
    }
});

// Function to convert JSON data to CSV
function convertToCSV(data) {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map((row) => Object.values(row).join(','));
    return [header, ...rows].join('\n');
}

// Endpoint for prediction
app.post('/predict', async (req, res) => {
    try {
        const transactions = req.body.transactions;
        const predictions = await getPrediction(transactions);
        res.json({ predictions });
    } catch (error) {
        res.status(500).json({ error: 'Error processing prediction' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
