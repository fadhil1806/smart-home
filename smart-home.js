const mqtt = require('mqtt');

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




module.exports = client

// client.on('connect', () => {
//     console.log('Connected to MQTT broker');

//     // Subscribe to the topic if needed
//     client.subscribe(topic, (error) => {
//         if (error) {
//             console.error('Subscription error:', error);
//         } else {
//             console.log(`Subscribed to topic '${topic}'`);
//         }
//     });

//     // Publish a message to the topic
//     client.publish(topic, 'on led bar', { qos: 0, retain: false }, (error) => {
//         if (error) {
//             console.error('Publish error:', error);
//         } else {
//             console.log(`Message sent to topic '${topic}'`);
//         }
//     });
// });

// // Optional: Handle incoming messages (if you're subscribing)
// client.on('message', (topic, message) => {
//     console.log(`Received message from topic '${topic}': ${message.toString()}`);
// });

// // Optional: Handle errors
// client.on('error', (error) => {
//     console.error('MQTT Client Error:', error);
// });
