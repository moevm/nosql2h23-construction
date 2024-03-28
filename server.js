const express    = require('express');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const session    = require('express-session');
const moment     = require('moment');

const multer     = require('multer');

const mongoose = require('mongoose');
const path = require("path");

const fs    = require('fs');


require('dotenv').config()

const {importAllCollections, exportAllCollections} = require('./backup');
const { mongoGetUsers, mongoFindUser, mongoAddUser} = require('./database/users');
const { mongoGetMaterials, mongoFindMaterial, mongoAddMaterial, mongoUseMaterialsPositions, mongoUseMaterialsStock } = require('./database/materials');
const { mongoGetInvoices, mongoGetInvoicesMaterials, mongoFindInvoice, mongoAddInvoice, mongoDeleteInvoice} = require('./database/invoices');
const { mongoQueryUsageYear, mongoQueryUsagePerson, mongoQueryUsageHistoric, mongoAddStatistics} = require('./database/statistics');

const PORT = process.env.PORT;
const URI = `${process.env.MONGODB_URI}/${process.env.DB_NAME}`;

console.log(URI)
const templatePath = path.join(__dirname, './templates')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

const upload = multer({ storage: storage});


app = express()

app.set('view engine', 'ejs');
app.set("views", templatePath)

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false
}));


app.use('/styles', express.static(__dirname + '/assets/css'))
app.use('/js', express.static(__dirname + '/assets/js'))
app.use('/images', express.static(__dirname + '/assets/imgs'))

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


app.use((req, res, next) => {
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {console.log("Connected to the database")})



// Routes
app.get('/', (req, res) => {
    res.redirect('/login');
})

// Routes
app.get('/login', async (req, res) => {
    res.render('login', {error: '0'});
})


app.get('/home', async (req, res) => {

    if(req.session.username === undefined && req.session.role === undefined){
        res.redirect('/login');
    }

    else{

        const materials = await mongoGetMaterials();

        res.render("home", {materials: materials, username: req.session.username, role: req.session.role, avatar: req.session.avatar.content.data});
    }
})

app.get('/positions', async (req, res) => {
    if(req.session.username === undefined && req.session.role === undefined){
        res.redirect('/login');
    }

    else{
        const materials = await mongoGetMaterials();
        res.render("positions", {materials: materials, username: req.session.username, role: req.session.role, avatar: req.session.avatar.content.data});
    }
})

app.get('/backup', async(req, res) => {

    if(req.session.username === undefined && req.session.role === undefined){
        res.redirect('/login');
    }
    else{
        const notif = req.query.notif === undefined ? 0 : req.query.notif;

        const materials = await mongoGetMaterials();
        res.render("backup", {materials: materials, username: req.session.username, role: req.session.role, notif: notif, avatar: req.session.avatar.content.data});
    }

})


app.post('/import', async (req, res) => {
    const data = req.body.fileUpload;
    importAllCollections(data);
    res.redirect('/backup?notif=1');

})

app.post('/export', async (req, res) => {
    const outputFilename = req.body.output;
    exportAllCollections(outputFilename);
    res.redirect('/backup?notif=2');
})

app.get('/logout', async (req, res) => {
    
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            res.sendStatus(500);
        } else {
            res.redirect('/login');
        }
    });
})

app.get('/warehouse', async (req, res) => {

    if(req.session.username === undefined && req.session.role === undefined){
        res.redirect('/login');
    }else{
        const invoices = await mongoGetInvoices();
    
        const notif = req.query.notif === undefined ? 0 : req.query.notif;
    
        const data = await mongoGetInvoicesMaterials();
    
        let json = {}
    
        for (var i = 0; i < data.length; i++){
            const id = data[i].material_id;
            const name = data[i].name;
    
            json[id] = name;
        }
    
        res.render("warehouse", {invoices: invoices, materials: json, notif: notif, username: req.session.username, role: req.session.role, avatar: req.session.avatar.content.data});
    }
    
})


app.get('/invoices', async (req, res) => {

    if(req.session.username === undefined && req.session.role === undefined){
        res.redirect('/login');
    }else{

        const notif = req.query.notif === undefined ? 0 : req.query.notif;

        const materials = await mongoGetMaterials();
        res.render('invoices', {materials: materials, username: req.session.username, role: req.session.role, notif: notif, avatar: req.session.avatar.content.data});
    }

})

app.get('/statistics', async (req, res) => {
    if(req.session.username === undefined && req.session.role === undefined){
        res.redirect('/login');
    }else{
       

        const materials = await mongoGetMaterials();
        var material_id = req.query.id;
    
        // console.log("material_id: ", material_id)
    
        console.log(materials[0])
        if (material_id == undefined){
            material_id = '65ad3b1e3c6235c300370c27';
        }
         
        let t = await mongoFindMaterial(material_id);

        if (t != null){
            let data = await mongoQueryUsageYear(material_id);
            let new_data = await mongoQueryUsagePerson(material_id);
            let historic = await mongoQueryUsageHistoric(material_id);
    
            console.log("new data", new_data)
            console.log("historic", historic)
            
            res.render('statistics', {
                materials: materials, 
                username: req.session.username, 
                role: req.session.role,
                avatar: req.session.avatar.content.data,
                data: (await data), 
                new_data: (await new_data),
                historic: (await historic),
                material: t.name,
                moment: moment
            });
        }
    }
})

app.post('/login', async(req, res) => {
    const data = {
        username: req.body.log,
        password: req.body.password
    }
    try{
        let val = await mongoFindUser(data);

        req.session.username = data.username;
        req.session.role = val[0].role;
        req.session.avatar = val[0].avatar;

        console.log(req.session.avatar)

        res.redirect("/home")
    }

    catch{
        res.render("login", {error: '1'})
    }
    
});

app.post('/createMaterial', async (req, res) => {
    
    // console.log("we have entered here")
    // console.log(req.body.name, req.body.type, req.body.unit, req.body.description)

    await mongoAddMaterial(req.body);

    res.redirect('/invoices?notif=1')
})

app.post('/useMaterials', async (req, res) => {

    let data = req.body

    for(const key in data){
        const id  = key;
        const qty = data[key];    
    
        await mongoUseMaterialsPositions(id, -qty);

    };

    let array = [];
    
    for(elem in req.body){
        array.push({material_id: elem, quantity: req.body[elem]});
    }

    let person = await mongoFindUser({username: req.session.username})

    await mongoAddStatistics(new Date(),person[0]._id, array);

    res.redirect('/');
})

app.post('/validateInvoice/:id', async (req, res) => {
    
    // It's the id of the invoice that we need to validate
    let id = req.body.id;

    /* console.log(id); */

    const invoice = await mongoFindInvoice(id);    
    
    console.log(invoice);



    for(const key in invoice.contain){
        const id  = invoice.contain[key].material_id;
        const qty = invoice.contain[key].quantity;    

        /* Case from factories to warehouse */
        if(invoice.type == "Enter"){
            console.log("we add material to the stock because there is an invoice")
            await mongoUseMaterialsStock(id, qty);
        }

        /* Case from warehouse to positions */ 
        else{
            await mongoUseMaterialsPositions(id, qty);
            await mongoUseMaterialsStock(id, -qty);
        }
    }

    mongoDeleteInvoice(id);
    res.redirect('/warehouse?notif=1');
})


app.post('/invoices', async(req, res) =>{
    console.log(req.body);
    await mongoAddInvoice(req.body);

    res.redirect('/');
})




// Routes
app.get('/signup', (req, res) => {
    res.render('signup');
})

app.post('/signup', upload.single('image'), async (req, res) => {
        if(!req.file){
            console.log("No file uploaded.");
            image = undefined;
        }
        else{
            var avatar = {
                name: req.file.originalname,
                content:  fs.readFileSync(req.file.path),
                type: req.file.mimetype
            }
        }

        fs.unlinkSync(req.file.path);
        mongoAddUser(req.body.log, req.body.password, 'Worker', avatar);
        res.redirect('login')
    })


app.get("/getUsers", (req, res) => {
    const users = mongoGetUsers();
    res.json(users).catch(function(err){console.log(err)})
});

app.get("/getmaterials", (req, res) => {
    mongoGetMaterials.then(function(materials){
        res.json(materials)
    }).catch(function(err){
        console.log(err)
    })
});

app.get("/getmaterials/:invoice", async (req, res) => {
    let invoice = req.body.invoice;

    let request = await mongoFindInvoice(invoice);

    request.contain.forEach((element) => {console.log(element.material_id); console.log(element.quantity)})

})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});


async function setStatistics(){
    let persons_array = ['65b404a4c65eaeb2182792ec', '65b402f7088ddb20c1c0c7c9', '65b40418c65eaeb2182792ea']
    let materials_array = []
    // let a = (await mongoGetUsers()).forEach((element => {persons_array.push(element._id)}));
    let b = (await mongoGetMaterials()).forEach((element => {materials_array.push(element._id)}));
    
    let MAX_QUANTITY = 1000

    let len_persons   = persons_array.length
    let len_materials = materials_array.length

    console.log(persons_array)
    console.log(materials_array)

    // Get today's date
    var today = new Date();

    // Get last year's date
    var lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    

    // Loop over months from last year to today
    for (var d = new Date(lastYear); d <= today; d.setMonth(d.getMonth() + 1)) {
        // Get month and year


        let number_persons = getRandomInt(1, len_persons)
        let number_materials = getRandomInt(1, len_materials)

        for(var i = 0; i < number_persons; i++){
            let person_id = getRandomInt(0, len_persons - 1);
            let contain = []
            for(var j = 0; j < number_materials; j++){
                let material_id = getRandomInt(0, len_materials - 1);
                let quantity = getRandomInt(1, MAX_QUANTITY) 
                contain.push({material_id: materials_array[material_id], quantity: quantity})
            }

            await mongoAddStatistics(d, persons_array[person_id], contain);
        }

        // Output month and year
        // console.log("Loop")
    }
}

// Function to generate a random integer within a specific range
function getRandomInt(min, max) {
    // Use Math.floor to round down to the nearest whole number
    // Use Math.random() to generate a pseudo-random decimal between 0 and 1
    // Multiply it by the range (max - min + 1) and add min to offset the result
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function setStatistics(){
//     const materials = await mongoGetMaterials();
// }


// Write the code that will set the statistics

