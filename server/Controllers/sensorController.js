import Sensor from '../Models/sensorModel.js';

function formatDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

async function handleUpload(req, res) {
    const { temperature, humidity } = req.body;
        console.log(temperature, humidity)
    if (!temperature || !humidity) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const now = new Date();
    const timestamp = formatDateTime(now);

    try {
        const reading = await Sensor.create({ timestamp, temperature, humidity });
        return res.status(201).json({ message: 'Success', sensorData:reading });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

async function handleFetch(req, res) {
    try {
        
        const readings = await Sensor.find().sort({ timestamp: -1 });
        return res.status(200).json({ message: 'Success', readings });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

export { handleUpload, handleFetch };
