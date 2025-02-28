import express from "express"
import path from "path"
import route from "./routes/post.js"

import methodOverride from 'method-override';

const app = express()
const PORT = 3000;
app.use(express.json())
app.use(express.urlencoded({extended: true}));

const publicPath = path.resolve("public")
const viewsPath = path.resolve("views")
app.use(express.static(publicPath))

app.get('/', (req, res) => {

    res.render("home");
})


app.use(methodOverride('_method'));
app.set("view engine", "ejs");
app.set("views", viewsPath);
app.use(route)

app.listen(PORT, () => {
    console.log("Server running on port " + PORT)
})



