const express = require('express');
const node = express();
require('dotenv').config();
const port = process.env.PORT
node.use(express.json())

const userRouter = require('./routers/userrouter');
node.use('/api', userRouter)

node.listen(port, () => console.log(`http://localhost:${port}`))