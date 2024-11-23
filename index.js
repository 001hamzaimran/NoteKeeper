const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const port = 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));



app.get("/", (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    res.render("index", { files: files });
    if (err) {
      console.log(err);
    }
  })
});

app.get("/files/:title", (req, res) => {
fs.readFile(`./files/${req.params.title}`, "utf-8", (err, data) => {
  res.render("file", { title: req.params.title, content: data });
})
});

app.get("/edit/:title", (req, res) => {
  fs.readFile(`./files/${req.params.title}`, "utf-8", (err, data) => {
    res.render("edit",{title: req.params.title, content: data});
    
  })
})

app.get("/delete/:title", (req, res) => {
  fs.unlink(`./files/${req.params.title}`, (err)=>{
    res.redirect("/");
  })
})

  app.post("/edit",(req,res)=>{
    console.log(req.body);
    fs.rename(`./files/${req.body.prevtitle}`, `./files/${req.body.updatetitle}`, (err)=>{
      res.redirect("/");
    })
    
  })

app.post("/create", (req, res) => {
  fs.writeFile(`./files/${req.body.title.split(" ").join("-")}.txt`, req.body.task, (err)=>{
    res.redirect("/");
  })
});

app.listen(port);