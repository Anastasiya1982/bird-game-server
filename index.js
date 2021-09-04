const express=require('express');
const dotenv = require('dotenv');
const cors=require('cors');
const cookieParser=require('cookie-parser');
const mongoose = require('mongoose');
const router= require('./router/index');
const errorMiddleware=require('./middlewares/error-middleware');
dotenv.config();
const methodOverride=require('method-override');

const port = process.env.PORT || 5000;
const app=express();

mongoose.set('useFindAndModify', false);
app.use(cors({
    credentials:true,
    origin:process.env.CLIENT_URL
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);
app.use(errorMiddleware);
app.use(methodOverride('_method'));

const start=async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        app.listen(port,()=>{
            console.log(`Port is listening on  port = ${port}`)
        })
    } catch (e) {
        console.log(e)
    }
}
 start();
