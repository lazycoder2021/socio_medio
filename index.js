const express = require('express'); 
const mongoose = require('mongoose'); 
const app = express(); 
const MongoStore = require('connect-mongo');
const session = require('express-session'); 
const cookieparser = require('cookie-parser'); 
const fileUpload = require('express-fileupload');
const path = require('path');
const User = require('./model/User'); 

app.use(fileUpload());
app.use(cookieparser());




app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://dbuser:dbuser@cluster0.zghpco5.mongodb.net/?retryWrites=true&w=majority', collection: 'sessions' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}))

const router = require('./routes/routes');


app.use(express.json()); 
app.use(express.static('public')); 
app.use('/', router); 

app.post('/upload', (req, res) => {
    if (!req.files) {
        res.status(400).send("No files were updated");
    }

    const file = req.files.myfile;
    const path2 = path.join(__dirname, "/public/files/" + file.name);
    path2.toString();
    console.log(path2.slice(60)); 
    const shortUrl = path2.slice(60); 

    file.mv(path2, async (err) => {
        if (err) {
            res.status(500).send(err)
        } else {
            const userExists = await User.findOne({ _id: req.session.userId });
            userExists.profile = shortUrl;
            await userExists.save();
            //res.status(200).send({ status: 'file uploaded successfully, go back and click update button to update your record', path: path2, userId: req.session.userId, userdetails: userExists })
            res.status(200).json({ "status": "file uploaded successfully, go back and reload page to view photo", "path": path2, "userdetails": userExists }) 
        }
        
    })

})

app.post('/postupload', (req, res) => {
    if (!req.files) {
        return res.status(400).send("No files were updated");
    }

    const file = req.files.myfile2;
    const path2 = path.join(__dirname, "/public/images/" + file.name);
    path2.toString();
    console.log(path2.slice(60));
    const shortUrl = path2.slice(60);
    

    file.mv(path2, async (err) => {
        if (err) {
            res.status(500).send(err)
        } else {
            res.status(200).json({ "url": shortUrl, "msg": "go back and paste above url (after removing a backslash duplication) in image url box, to create post with image" });
        }

    })
   

})




app.listen('3000', function () {
    console.log('server up and running....')
    //mongoose.connect('mongodb://localhost:27017/following');
    mongoose.connect('mongodb+srv://dbuser:dbuser@cluster0.zghpco5.mongodb.net/?retryWrites=true&w=majority'); 
    mongoose.connection.on('open', function () {
        console.log('db connected....')
    })
})

