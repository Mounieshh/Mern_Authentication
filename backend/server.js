import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import {notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
dotenv.config()
connectDB()
const port = process.env.PORT || 5000
const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Cookie Parser
app.use(cookieParser())

//Routes
app.use('/api/users', userRoutes)

app.get('/', (req,res) => res.send('Server Ready'))

//MiddleWare
app.use(notFound)
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))