const mongoose = require('mongoose');

// connect to mongodb
mongoose.connect(process.env.MONGODB_URI,{}, (error) => {
    if (error) {
        console.log('unable to connect to the database!!');
        console.log(error);
        return;
    }

    console.log('connected to database: ' + process.env.MONGODB_URI);
});
