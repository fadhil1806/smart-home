const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mqtt = require('mqtt');

const app = express();
const PORT = process.env.PORT || 7000;

// MQTT Client Configuration
const host = 'system-smart.cloud.shiftr.io';
const port = '1883';
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'system-smart',
    password: 'fadhil',
    reconnectPeriod: 1000,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Ensure the MQTT client connects before handling requests
client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

// Endpoint for handling POST requests
app.post('/api/data', async (req, res) => {
    const { message } = req.body;
    console.log(`Received message: ${message}`);

    const topic = 'system/smart/home/fadhil';

    // Publish message to MQTT topic
    client.publish(topic, message, { qos: 0, retain: false }, (error) => {
        if (error) {
            console.error('Publish error:', error);
            return res.status(500).json({ status: false, error: 'Failed to publish message' });
        } else {
            console.log(`Published to topic '${topic}': ${message}`);
            return res.json({ status: true, received: message });
        }
    });
});

let tempHumidityData = {};


client.subscribe('system/smart/home/fadhil/monitoring', { qos: 1 }, (err) => {
    if (!err) {
        console.log('Subscribed to: system/smart/home/fadhil/monitoring');
    } else {
        console.error('Error subscribing:', err);
    }
});
client.on('message', (topic, message) => {
    // Ensure the correct topic
    if (topic === 'system/smart/home/fadhil/monitoring') {
        const msgString = message.toString();
        console.log('Received message:', msgString);

        // Parse temperature data
        if (msgString.includes('Temp')) {
            const temperature = parseFloat(msgString.match(/[\d.]+/)[0]);
            tempHumidityData.temperature = temperature;
            console.log(`Temperature: ${temperature}°C`);
        }
        // Parse humidity data
        else if (msgString.includes('Humidity')) {
            const humidity = parseFloat(msgString.match(/[\d.]+/)[0]);
            tempHumidityData.humidity = humidity;
            console.log(`Humidity: ${humidity}%`);
        }

        // Log the updated temperature and humidity data
        console.log('Updated tempHumidityData:', tempHumidityData);
    }
});

const dataParking = {}

client.subscribe('system/parking/fadhil', { qos: 1 }, (err) => {
    if (!err) {
        console.log('Subscribed to: system/parking/fadhil');
    } else {
        console.error('Error subscribing:', err);
    }
});

client.on('message', (topic, message) => {
    if (topic === 'system/smart/home/fadhil/monitoring') {
        const msgString = message.toString();
        console.log('Received monitoring message:', msgString);

        if (msgString.includes('Parkir 2')) {
            dataParking.parking2 = msgString;
        } else if (msgString.includes('Parkir 3')) {
            dataParking.parking3 = msgString;
        } else if (msgString.includes('Mobil')) {
            // Tambahkan logika untuk menangani pesan mobil di sini
        }
    } else if (topic === 'system/parking/fadhil') {
        const msgString = message.toString();
        console.log('Received parking message:', msgString);
        // Misalnya, simpan informasi parkir ke dalam dataParking
        dataParking.parkingInfo = msgString; // Contoh
    }
});


app.get('/api/data/dht', (req, res) => {
    if (tempHumidityData.temperature && tempHumidityData.humidity) {
        res.json(tempHumidityData);
    } else {
        res.status(404).json({ message: 'No data available' });
    }
});

app.get('/api/data/parking/system', (req, res) => {
    console.log(dataParking)
    if (Object.keys(dataParking).length > 0) {
        res.json(dataParking);
    } else {
        res.status(404).json({ message: 'No parking data available' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
