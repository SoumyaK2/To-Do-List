const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const date = require(__dirname + "/date.js");      //import static module

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));




mongoose.connect("mongodb+srv://[your_username:your_password]@cluster0.qd0gmjo.mongodb.net/todolistDB");

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({ name: "I'm glad you're here." });

const item2 = new Item({ name: "What are you aiming for today?" });

const defultArray = [item1, item2];



const ideiaSchema = {
    name: String,

    userItem: [itemSchema]
};

const Ideia = mongoose.model("Ideia", ideiaSchema);


let day = date.getDate();                    //calling for static module function


app.get("/", (req, res) => {


    Item.find().then((data) => {

        if (data.length === 0) {
            Item.insertMany(defultArray).then(() => { console.log("Succesfully added items to todolistDB"); }).catch((err) => { console.log(err); });

            res.redirect("/");
        } else {
            res.render("list", { kindOfday: day, newItem: data });
        }
    });


});

app.post("/", (req, res) => {


    var item = req.body.addItem;
    const pageName = req.body.page;

    const item3 = new Item({ name: item });

    if (pageName === day) {
        item3.save();

        res.redirect("/");
        res.redirect("/");
    } else {

        Ideia.findOne({ name: pageName }).then((data) => {

            data.userItem.push(item3);
            data.save();

            res.redirect("/" + pageName);


        }).catch((err) => {
            console.log(err);
        });

    }


})


app.post("/delete", (req, res) => {
    const checkboxId = req.body.chackBox;
    const pageTitle = req.body.pageTitle;

    if (pageTitle === day) {
        Item.deleteOne({ _id: checkboxId }).then(() => { console.log("Succesfully Deleted"); }).catch((err) => { console.log(err); });

        res.redirect("/");

    } else {
        Ideia.findOneAndUpdate({ name: pageTitle }, { $pull: { userItem: { _id: checkboxId } } }).then(() => {
            res.redirect("/" + pageTitle);
        }).catch((err) => {
            console.log(err);
        });

    }    
})



//  Makeing a custom List
app.get("/:urlParameter", (req, res) => {
    const userIdeia = _.capitalize(req.params.urlParameter);

    if (userIdeia === "About") {
        res.render("about");
    } else {

        Ideia.findOne({ name: userIdeia }).then((data) => {

            if (!data) {

                const ideia1 = new Ideia({
                    name: userIdeia,
                    userItem: defultArray
                });

                ideia1.save();
                

                res.redirect("/" + userIdeia);

            } else {
                res.render("list", { kindOfday: data.name, newItem: data.userItem});
                
            }

        }).catch((err) => {
            console.log(err);
        });
    }


})

app.listen(80, () => {
    console.log("Your server is running at port : 80")
});


