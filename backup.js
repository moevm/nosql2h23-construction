const {exec}  = require('child_process');
const fs    = require('fs');

const URI = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`;

// Function to split a big JSON file into smaller JSON files for each collection
function splitCollections(bigJSONFilename) {
    try {
        // Read the big JSON file
        const bigJSON = JSON.parse(fs.readFileSync(bigJSONFilename, 'utf8'));


        console.log(Object.keys(bigJSON));
        // Iterate over each key (collection name) in the big JSON object
        Object.keys(bigJSON).forEach(collectionName => {
            // Extract data for the current collection
            const collectionData = bigJSON[collectionName];

            // Write the data for the current collection into a separate JSON file
            const collectionFilename = `${collectionName}.json`;
            fs.writeFileSync(collectionFilename, JSON.stringify(collectionData, null, 2));

            console.log(`Created ${collectionFilename}`);
        });
    } catch (error) {
        console.error('Error splitting collections:', error);
    }
}


// Function to export a collection to JSON using mongoexport
async function exportCollection(collectionName) {
    return new Promise((resolve, reject) => {
        const command = `mongoexport --uri="${URI}" --collection=${collectionName} --out=${collectionName}.json --jsonArray`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error exporting ${collectionName}: ${stderr}`);
                reject(error);
            } else {
                console.log(`Exported ${collectionName}`);
                resolve();
            }
        });
    });
}

// Function to export a collection to JSON using mongoimport
function importCollection(collectionName) {
    return new Promise((resolve, reject) => {
        const command = `mongoimport --uri="${URI}" --collection=${collectionName} --drop --file=${collectionName}.json --jsonArray`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error importing ${collectionName}: ${stderr}`);
                reject(error);
            } else {
                console.log(`Imported ${collectionName}`);
                resolve();
            }
        });
    });
}

// Function to read and merge JSON files into one JSON object
function mergeJSONFiles() {
    const mergedData = {};

    const jsonFiles = fs.readdirSync('./database').map(item => item + 'on');

    console.log(jsonFiles);

    jsonFiles.forEach(file => {
        const data = JSON.parse(fs.readFileSync(file, 'utf8'));
        mergedData[file.split('.')[0]] = data;
    });
    return mergedData;
}

// Function to write merged JSON object to a single JSON file
function writeMergedJSON(data, outputFilename) {
    fs.writeFileSync('./backup/' + outputFilename, JSON.stringify(data, null, 2));
    const jsonFiles = fs.readdirSync('./database').map(item => item + 'on');
    jsonFiles.forEach((path) => fs.unlinkSync(path));
    
    console.log(`Merged data written to ${outputFilename}`);
}

// Main function to export all collections and merge them into one JSON file
async function exportAllCollections(output) {
    try {
        // Replace 'collection1', 'collection2', etc. with the names of your collection

        await exportCollection('users');
        await exportCollection('materials');
        await exportCollection('statistics');
        await exportCollection('invoices');

        const mergedData = mergeJSONFiles();
        writeMergedJSON(mergedData, output);

    } catch (error) {
        console.error('Error exporting collections:', error);
    }
}

// Main function to export all collections and merge them into one JSON file
async function importAllCollections(inputFileName) {
    try {
        // Replace 'collection1', 'collection2', etc. with the names of your collection

    splitCollections('./backup/' + inputFileName)

        await importCollection('users');
        await importCollection('materials');
        await importCollection('statistics');
        await importCollection('invoices');

        const jsonFiles = fs.readdirSync('./database').map(item => item + 'on');
        jsonFiles.forEach((path) => fs.unlinkSync(path));

    } catch (error) {
        console.error('Error exporting collections:', error);
    }
}


module.exports = {
    importAllCollections, exportAllCollections, importCollection, exportCollection
}