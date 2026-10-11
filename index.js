require('dotenv').config()
const app = require('./src/app');
const { connectDB } = require('./src/configs/db');

app.listen(process.env.PORT, async () => {

    await connectDB()

    console.log(`Server is running on port ${process.env.PORT}`)

})