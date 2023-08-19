const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mongoose = require('mongoose')
const date = require(__dirname + "/date.js");
const _ = require("lodash")
//console.log(date);
const app = express();
//console.log(date());

app.set("view engine", "ejs" );
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));

mongoose.connect("mongodb+srv://tyfoon:tyfoon_123@cluster0.ikbgoe1.mongodb.net/todolistDB" )


const itemsSchema = new mongoose.Schema({
    name : {
        type: String,
        required : true
    }
})

const Item = mongoose.model("Item" , itemsSchema)

const task1 = new Item({
    name: "Welcome to your To-Do-List"
})
const task2 = new Item({
    name: "Hit the + button to add a new Item"
})
const task3 = new Item({
    name: "<  -- Hit this to delete an item."
})

const defaultItems = [task1, task2 ,task3];

const listSchema = {
    name : String,
    items : [itemsSchema]
}

const List = mongoose.model("List", listSchema)

app.get("/" ,function(req ,res){
    var day = date.getDate();
    console.log("Non parameterized");
    Item.find().then(arr =>{
        if(arr.length === 0){
            Item.insertMany(defaultItems).then(()=>{
                console.log("Successfully added default items to DB");
            })
            res.redirect("/")
        }
        else{
            res.render("list" , {NameOfDay: day , ntask : arr});
        }
    
     })
    
     console.log("returning...");
        
});

app.get('/favicon.ico' , (req,res)=>{
    console.log("favi part");
    res.redirect("/");
})
app.get("/about" , function(req ,res){
    res.render("about" );
});

app.get("/:customListName",(req,res)=>{
    console.log("Parameterized");
    const listName = _.capitalize(req.params.customListName) 
    
    List.findOne({name:listName} ).then((foundList)=>{
        if(foundList){
            console.log("Exist !");
         //   console.log(foundList);
           res.render("list" , {NameOfDay : foundList.name , ntask : foundList.items })
        }
        else{
            console.log("Doesn't Exist !");
            const list = new List({
                name: listName,
                items: defaultItems
            })
            list.save()
            res.redirect("/" + listName)
        }
    }).catch(err=>{
        console.log(err);
    })
    
})





app.post("/" , function(req , res){
    const taskName = req.body.newitem;
    const listName = req.body.list;
    console.log("listName ", listName);
    const newTask = new Item({
        name: taskName
    })

    if(listName === date.getDate()){
        console.log("Here");
        newTask.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listName}).then((list)=>{
            list.items.push(newTask)
            list.save()
            res.redirect("/" + listName)
        }).catch(err=>{
            console.log(err);
        })
    }


    
    
});

app.post("/delete" , function(req ,res){
   const item_id_to_be_removed = req.body.checkbox
   console.log("item id : " ,item_id_to_be_removed);
   
    const listName = req.body.listName
    console.log("ListName ", listName);
    if(listName === date.getDate()){
        Item.findByIdAndDelete(item_id_to_be_removed).then((e)=>{
            console.log(" item deleted successfully");
            res.redirect("/");
        })
        
        
    }
    else{
        /*
        List.findOne({name: listName}).then((list)=>{
            //console.log("List inside " ,  list.name);
            //console.log(list);
            

            const newListItem = list.items.filter((x)=>{
               console.log(x.id , " " , item_id_to_be_removed); 
               return x.id !== item_id_to_be_removed;
            })

            // console.log(list.items.length);
            // console.log(newListItem.length);

            List.findOneAndUpdate({name:list.name} , {items : newListItem }).then((e)=>{
                console.log("new List updated successfully");
            })

            
            
            res.redirect("/" + list.name)
        })
        */

        //Alternative delete method

        List.findOneAndUpdate({name:listName} , {$pull:{items: {_id:item_id_to_be_removed} }})
        .then((e)=>{
            console.log("New list updated Successfully");
            res.redirect("/" + listName)
        })
        
    }
   
   
})



app.listen(3000 ,function(){
    console.log("server started on port 3000");
});