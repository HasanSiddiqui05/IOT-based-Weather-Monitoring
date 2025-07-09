import mongoose from 'mongoose'
const sensorSchema = new mongoose.Schema({
    timestamp: {
        type: String, 
        required: true,
    },
    temperature: {
        type: Number,
        required: true,
    },
    humidity: {
        type: Number,
        required: true,
    },
});

const Sensor = mongoose.model('Sensor', sensorSchema);
export default Sensor;
