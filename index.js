const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");
const { log } = require("console");
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


app.post("/create", (req, res) => {
  fs.writeFile(`./files/${req.body.title.split(" ").join("-")}.txt`, req.body.task, (err) => {
    res.redirect("/");
    if (err) {
      console.log(err);
    }
  })
});

app.get("/files/:title", (req, res) => {
  fs.readFile(`./files/${req.params.title}`, "utf-8", (err, data) => {
    res.render("file", { title: req.params.title, content: data });
    if (err) {
      console.log(err);
    }
  })
});

app.get("/edit/:title", (req, res) => {
  
  fs.readFile(`./files/${req.params.title}`, "utf-8", (err, data) => {
    res.render("edit", { title: req.params.title, content: data });
    if (err) {
      console.log(err);
    }

  })
})

app.get("/delete/:title", (req, res) => {
  fs.unlink(`./files/${req.params.title}`, (err) => {
    res.redirect("/");
    if (err) {
      console.log(err);
    }
  })
})

app.post("/edit", (req, res) => {
  console.log(req.body);

  const oldFilePath = `./files/${req.headers.referer.split("/")[4]}`;
  const newFilePath = `./files/${req.body.updatetitle.split(" ").join("-")}.txt`;

  // Rename the file first
  fs.rename(oldFilePath, newFilePath, (err) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error renaming the file");
    }

    // Update the content of the renamed file
    fs.writeFile(newFilePath, req.body.task, (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error updating the file content");
      }

      res.redirect("/");
    });
  });
});




app.listen(port);