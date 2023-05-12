const bodyParser = require("body-parser");
const express = require("express");

const date= require(__dirname+"/date.js");      //import static module

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

var items = ["Good Morning", "Wake Up"];   //Setting global veriable
var workList = [];

app.get("/", (req, res) => {
    let day= date.getDate();                    //calling for static module function

    res.render("list", { kindOfday: day, newItem: items });
});

app.post("/", (req, res) => {
    
    var item = req.body.addItem;

    if (req.body.page === "Work") {        
        workList.push(item);

        res.redirect("/work");
    } else {
        items.push(item);

        res.redirect("/");  
    }

})

app.post("/delete",(req,res)=>{
    const delItem= req.body.chackBox;
    
    items.splice(delItem, 1);
    res.redirect("/");
})





app.get("/work", (req, res) => {


    res.render("list", { kindOfday: "Work List", newItem: workList });
});

app.get("/about", (req, res) => {


    res.render("about");
});


app.listen(80, () => {
    console.log("Your server is running at port : 80")
});


