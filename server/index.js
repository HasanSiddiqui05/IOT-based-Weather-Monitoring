import express from "express"; 
import ConnectDb from "./dbConnection.js";
import userRouter from './Routes/userRoutes.js'
import sensorRouter from './Routes/sensorRoutes.js'
import cookieParser from 'cookie-parser'
import  checkAuthToken  from "./Middlewares/Auth.js";
import cors from 'cors'
import axios from "axios"
import dotenv from 'dotenv'

const app = express();

//database connection
ConnectDb();
dotenv.config()
app.use(cors({origin:"http://localhost:5173",credentials:true}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/user',userRouter)

app.use('/api/sensor',sensorRouter)

app.post("/predict-weather", async (req, res) => {
    const { city } = req.body;
    console.log(req.body)
    if (!city) {
        return res.status(400).json({ error: "City name is required." });
    }
    try {
        
        const response = await axios.post(`${process.env.MODEL_URL}/predict/`, { city });
        console.log(response.data);
        res.status(200).json([...response.data]);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Failed to fetch predictions from Model." });
    }
});

app.listen(8000,()=>{
    console.log(`Server is Running...`)
})