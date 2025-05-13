const express = require('express');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Set up file upload using multer
const upload = multer({ dest: 'uploads/' });

// Serve static files from the "public" folder
app.use(express.static('public'));

// Endpoint to handle multiple CSV uploads
app.post('/upload', upload.array('csvFiles', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded.' });
    }

    const filePaths = req.files.map((file) => file.path);
    const allData = [];

    // Process each uploaded file
    let filesProcessed = 0;
    filePaths.forEach((filePath) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                allData.push(...results); // Merge data from all files
                filesProcessed++;

                // Clean up the uploaded file
                fs.unlinkSync(filePath);

                // When all files are processed, send the response
                if (filesProcessed === filePaths.length) {
                    const integrationAccuracy = calculateIntegrationAccuracy(allData);
                    res.json({ data: allData, accuracy: integrationAccuracy });
                }
            })
            .on('error', (err) => {
                res.status(500).json({ error: 'Failed to process CSV files.' });
            });
    });
});

// Function to calculate integration accuracy (example logic)
function calculateIntegrationAccuracy(data) {
    // Example: Assume 90% accuracy for demonstration
    const totalRecords = data.length;
    const matchedRecords = Math.floor(totalRecords * 0.9); // Simulate 90% matching
    return (matchedRecords / totalRecords) * 100;
}

// Endpoint to export integrated data as CSV
app.post('/export', (req, res) => {
    console.log('Export request received:', req.body); // Log the request body

    const data = req.body.data;

    if (!data || !Array.isArray(data)) {
        console.error('Invalid data received:', data); // Log invalid data
        return res.status(400).json({ error: 'Invalid data.' });
    }

    try {
        const csvData = convertToCSV(data);
        const fileName = `integrated_data_${Date.now()}.csv`;

        console.log('Writing CSV file:', fileName); // Log file creation
        fs.writeFileSync(fileName, csvData, 'utf8');

        console.log('Sending file to client:', fileName); // Log file download
        res.download(fileName, () => {
            console.log('Cleaning up file:', fileName); // Log file cleanup
            fs.unlinkSync(fileName);
        });
    } catch (err) {
        console.error('Error exporting data:', err); // Log any errors
        res.status(500).json({ error: 'Failed to export data.' });
    }
});

// Function to convert JSON data to CSV
function convertToCSV(data) {
    const header = Object.keys(data[0]).join(',');
    const rows = data.map((row) => Object.values(row).join(','));
    return [header, ...rows].join('\n');
}

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});