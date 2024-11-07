import express, { Request, Response } from 'express';
import mqtt from 'mqtt';
import cors from 'cors'

const app = express();
app.use(express.json());
app.use(cors())

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

client.on('connect', () => {
    console.log('Connected to MQTT broker');
});

app.post('/api/data', async (req: Request, res: Response) => {
    const { message } = req.body;

    if (typeof message !== 'string') {
        return res.status(400).json({ status: false, error: 'Invalid message format' });
    }

    console.log(`Received message: ${message}`);
    const topic = 'system/smart/home/fadhil';

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

interface TempHumidityData {
    temperature?: number;
    humidity?: number;
}

let tempHumidityData: TempHumidityData = {};

client.subscribe('system/smart/home/fadhil/monitoring', { qos: 1 }, (err) => {
    if (!err) {
        console.log('Subscribed to: system/smart/home/fadhil/monitoring');
    } else {
        console.error('Error subscribing:', err);
    }
});

client.on('message', (topic: string, message: Buffer) => {
    if (topic === 'system/smart/home/fadhil/monitoring') {
        const msgString = message.toString();

        if (msgString.includes('Temp')) {
            const temperature = parseFloat(msgString.match(/[\d.]+/)?.[0] || '0');
            tempHumidityData.temperature = temperature;
        } else if (msgString.includes('Humidity')) {
            const humidity = parseFloat(msgString.match(/[\d.]+/)?.[0] || '0');
            tempHumidityData.humidity = humidity;
        }
    }
});

app.get("/", (req: Request, res: Response) => res.status(200).json({ message: 'Hello Fadhil Rabbani!' }));

app.get('/api/data/dht', (req: Request, res: Response) => {
    if (tempHumidityData.temperature !== undefined && tempHumidityData.humidity !== undefined) {
        res.json(tempHumidityData);
    } else {
        res.status(404).json({ message: 'No data available' });
    }
});

app.listen(3000, () => console.log("Server ready on port 3000."));

export default app;
