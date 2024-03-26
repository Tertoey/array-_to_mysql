const a = {
    "temperature": [
        {
            "ts": 1711418616107,
            "value": "25"
        },
        {
            "ts": 1711362117144,
            "value": "25"
        },
        {
            "ts": 1711361990198,
            "value": "18"
        },
        {
            "ts": 1711361802207,
            "value": "23"
        },
        {
            "ts": 1711355640421,
            "value": "23"
        },
        {
            "ts": 1711355394447,
            "value": "25"
        },
        {
            "ts": 1711354865154,
            "value": "25"
        },
        {
            "ts": 1711354824818,
            "value": "35"
        },
        {
            "ts": 1711354802173,
            "value": "35"
        },
        {
            "ts": 1711354677452,
            "value": "20"
        },
        {
            "ts": 1711354595040,
            "value": "65"
        },
        {
            "ts": 1711354390782,
            "value": "40"
        },
        {
            "ts": 1711352609797,
            "value": "35"
        },
        {
            "ts": 1711352507538,
            "value": "35"
        },
        {
            "ts": 1711352488707,
            "value": "25"
        }
    ],
    "pressure": [
        {
            "ts": 1711418616107,
            "value": "20"
        },
        {
            "ts": 1711362117144,
            "value": "20"
        },
        {
            "ts": 1711361990198,
            "value": "30"
        },
        {
            "ts": 1711361802207,
            "value": "20"
        },
        {
            "ts": 1711355640421,
            "value": "20"
        },
        {
            "ts": 1711355394447,
            "value": "12"
        },
        {
            "ts": 1711354865154,
            "value": "12"
        },
        {
            "ts": 1711354824818,
            "value": "15"
        },
        {
            "ts": 1711354802173,
            "value": "56"
        },
        {
            "ts": 1711354677452,
            "value": "20"
        },
        {
            "ts": 1711354595040,
            "value": "65"
        },
        {
            "ts": 1711354390782,
            "value": "40"
        },
        {
            "ts": 1711352609797,
            "value": "35"
        },
        {
            "ts": 1711352507538,
            "value": "35"
        },
        {
            "ts": 1711352488707,
            "value": "25"
        }
    ],
    "level": [
        {
            "ts": 1711418616107,
            "value": "20"
        },
        {
            "ts": 1711362117144,
            "value": "20"
        },
        {
            "ts": 1711361990198,
            "value": "30"
        },
        {
            "ts": 1711361802207,
            "value": "20"
        },
        {
            "ts": 1711355640421,
            "value": "20"
        },
        {
            "ts": 1711355394447,
            "value": "12"
        },
        {
            "ts": 1711354865154,
            "value": "12"
        },
        {
            "ts": 1711354824818,
            "value": "15"
        },
        {
            "ts": 1711354802173,
            "value": "56"
        },
        {
            "ts": 1711354677452,
            "value": "20"
        },
        {
            "ts": 1711354595040,
            "value": "65"
        },
        {
            "ts": 1711354390782,
            "value": "40"
        },
        {
            "ts": 1711352609797,
            "value": "35"
        },
        {
            "ts": 1711352507538,
            "value": "35"
        },
        {
            "ts": 1711352488707,
            "value": "25"
        }
    ],
    "air": [
        {
            "ts": 1711418616107,
            "value": "20"
        },
        {
            "ts": 1711362117144,
            "value": "20"
        },
        {
            "ts": 1711361990198,
            "value": "30"
        },
        {
            "ts": 1711361802207,
            "value": "20"
        },
        {
            "ts": 1711355640421,
            "value": "20"
        },
        {
            "ts": 1711355394447,
            "value": "12"
        },
        {
            "ts": 1711354865154,
            "value": "12"
        },
        {
            "ts": 1711354824818,
            "value": "15"
        },
        {
            "ts": 1711354802173,
            "value": "56"
        },
        {
            "ts": 1711354677452,
            "value": "20"
        },
        {
            "ts": 1711354595040,
            "value": "65"
        },
        {
            "ts": 1711354390782,
            "value": "40"
        },
        {
            "ts": 1711352609797,
            "value": "35"
        },
        {
            "ts": 1711352507538,
            "value": "35"
        },
        {
            "ts": 1711352488707,
            "value": "25"
        }
    ]
}


const mysql = require('mysql2/promise');

// Configuration for your MySQL connection
const connectionConfig = {
    host: '127.0.0.1',
    user: 'root',
    password: 'P@ssw0rd',
    database: 'userdata'
};
const mergedData = {};
// Iterate over temperature data
Object.keys(a).forEach(key => {
    a[key].forEach(data => {
        const { ts, value } = data;
        // If timestamp exists in mergedData, update the value for the corresponding key
        if (mergedData[ts]) {
            mergedData[ts][key] = value;
        } else {
            // If timestamp doesn't exist, create a new object with the key-value pair
            mergedData[ts] = { ts };
            mergedData[ts][key] = value;
        }
    });
});

// Convert mergedData object to array of values
const mergedArray = Object.values(mergedData);

// Function to write data to MySQL
async function writeToMySQL(data) {
    // Create a MySQL connection
    const connection = await mysql.createConnection(connectionConfig);

    try {
        // Begin transaction
        await connection.beginTransaction();

        // Insert each data point into the MySQL database
        for (const item of data) {
            // Convert Unix timestamp to MySQL datetime format
            const datetime = new Date(item.ts).toISOString().slice(0, 19).replace('T', ' ');

            // Insert data into MySQL table
            await connection.query('INSERT INTO testtt (ts, temperature, pressure, level, air) VALUES (?, ?, ?, ?, ?)', [
                datetime,
                item.temperature,
                item.pressure,
                item.level,
                item.air
            ]);
        }

        // Commit transaction
        await connection.commit();
        console.log('Data inserted successfully into MySQL.');
    } catch (error) {
        // Rollback transaction if there's an error
        await connection.rollback();
        console.error('Error inserting data into MySQL:', error);
    } finally {
        // Close connection
        await connection.end();
    }
}

// Usage: Call writeToMySQL function and pass the merged array of data
writeToMySQL(mergedArray);