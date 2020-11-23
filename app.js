var exp = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = exp();

app.set('view engine', 'ejs');

var port = process.env.PORT || 3000;
var hostName = 'localhost';

//variable to store student data in json file
let data = {
    student: [] // This is the array for storing Student data
};

//To store data temporarily
var temporaryData = {
    id: Number,
    name: String,
    rollNumber: String,
    department: String
}
//URl encoded used for getting the parsed body 
app.use(bodyParser.urlencoded({ extended: false }));

//Student Routes
//Get
app.get("/students", function (req, res) {
    console.log("Show all students");
    //Getting data from json file
    var readData=fs.readFileSync("./jsonFiles/data.json",'utf8');
    data=JSON.parse(readData);
    if (!data) {
        res.status(200).send("No record found!");
    }
    else
        res.json(data);
});

//GET - Single student data
app.get("/student/:name", (req, res) => {
    console.log("Student "+req.params.name);
    //Getting data from json file
    var readData=fs.readFileSync("./jsonFiles/data.json",'utf8');
    data=JSON.parse(readData);
    let studentName = req.params.name;
    let temporaryData;
    if (data) {
        temporaryData = data.student.filter(result => {
            return result.name == studentName;
        })[0];
    }
    if (!temporaryData)
        res.status(200).send("No records available")
    res.json(temporaryData);
});

app.get("/", function (req, res) {
    console.log("Home page");
    res.render("index");
});

//POST
app.post("/addStudent", function (req, res) {
    console.log("addStudent");
    temporaryData = {
        id: req.body.id,
        name: req.body.name,
        rollno: req.body.roll,
        dept: req.body.dept
    }
    data.student.push(temporaryData);
    fs.writeFileSync('./jsonFiles/data.json', JSON.stringify(data));
    res.status(200).end("Data added..");
});

app.put('/updateStudent/:name', (req, res) => {
    let studentName = req.params.name;
    //Getting data from json file
    var readData=fs.readFileSync("./jsonFiles/data.json",'utf8');
    data=JSON.parse(readData);

    //Getting particular student data
    let studentDetails = data.student.filter(details => {
        return studentName == details.name;
    })[0];
    
    //Getting index of data
    let index = data.student.indexOf(studentDetails);
    let updateFields = Object.keys(req.body);
    updateFields.forEach(f => {
        studentDetails[f] = req.body[f];
    });
    data.student[index] = studentDetails;

    //Writing updated data to json file
    fs.writeFileSync('./jsonFiles/data.json', JSON.stringify(data));
    res.json(data.student[index]);
});

app.delete('/removeStudent/:name', (req, res) => {
    let studentName = req.params.name;
    //Getting data from json file
    var readData=fs.readFileSync("./jsonFiles/data.json",'utf8');
    data=JSON.parse(readData);

    //Getting particular student data
    let deleteData = data.student.filter(studentData => {
        return studentName == studentData.name;
    })[0];

    //If no record found on that name return "no record fount"
    if(!deleteData)
    {
        res.status(200).end("No record found on the name :"+studentName);
    } else{
    //Getting index of data  
    let index = data.student.indexOf(deleteData);

    //Deleting using splice
    data.student.splice(index, 1);

    //Writing updated data to json file
    fs.writeFileSync('./jsonFiles/data.json', JSON.stringify(data));
    res.status(200).json({ message: ` The record of student ${studentName} is deleted` });
    }
});

//Listeing to port PORT or 3000
app.listen(port);


