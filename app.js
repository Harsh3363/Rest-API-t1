//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.get("/",function(req,res){
  res.sendFile(__dirname+"/index.html");
});
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true}); //--->this line of code allows mongoDB to connect to local server

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("articles", articleSchema);
///////////////////////////////////////////REQUEST TARGETING ALL THE ARTICLES////////////////////////////////////////////////////////////
// chained route --->

app.route("/articles").get(function(req,res){
Article.find({},function(err,result){
  if(!err){
    res.send(result);
}
else{res.send(err);}
  });
})

.post(function(req,res){
  const newArticle = new Article({
    title:req.body.title,
    content:req.body.content
  });
  newArticle.save(function(err){
    if(err){
      res.send(err);
    }else{
      res.send("success");
    }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("success");
    }else{
      res.send(err);
    };
  });
});
///////////////////////////////////////////REQUEST TARGETING SPECIFIC ARTICLES////////////////////////////////////////////////////////////
// route is changed to a particular article -->
app.route("/articles/:articleTitle")
////////////////////// get method ////////////
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
    if(foundArticle){
      res.send(foundArticle);
    }else{
      res.send("no such title found");
    }
  })
})
//////////// put method ////////////////////////
.put(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},{
$set:
  {"title":req.body.title}
},
   function(err){
     if(!err){
       res.send("success");
};
});
})
///////////////////// patch method ////////////////////
// since we are using $set flag in the put method it's already telling mongodb that we want to just edit those parts specified inside the $set flag
// .patch(function(req,res){
//   Article.updateOne(
//     {title:req.params.articleTitle},{
// $set:
//   {$set:req.body}//here we are telling the mongoDB to see through what are the things user wants to change and change that things only
// },
//    function(err){
//      if(!err){
//        res.send("success");
// };
// });
// });
///////////////////////// better use PUT with $set flag instead of PATCH ////////////

//////////////// DELETE METHOD ///////////////////////////////////////////////////////////
.delete(function(req,res){
  Article.deleteOne(
    {title:req.params.articleTitle},
       function(err){
         if(!err){
           res.send("success");
    };
    }
  );
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
