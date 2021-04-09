let http = require("http")
let fs = require("fs")

function ToDoApp(req, res) {
    if(req.method === "POST") {
        if(req.url === "/addTask") {
            readPOSTData(req, res, addTask)
        }
        else if(req.url === "/updateTask") {
            readPOSTData(req, res, updateTask)
        }
        else if(req.url === "/removeTask") {
            readPOSTData(req, res, removeTask)
        }
    }
    else if(req.method === "GET") {
        if(req.url === "/") {
            responseFile("files/index.html", "text/html", res)
        }
        else if(req.url === "/assets/style.css") {
            responseFile("files/assets/style.css", "text/css", res)
        }
        else if(req.url === "/assets/script.js") {
            responseFile("files/assets/script.js", "text/javascript", res)
        }
        else if(req.url === "/tasks") {
            responseFile("files/storage/table_db.txt", "application/json", res)
        }
        else {
            console.log(req.url, req.method)
        }
    }
}

let serverSetup = http.createServer(ToDoApp)

serverSetup.listen(8080)

console.log("Server is running")

function responseFile(fileLocation, contentType, res) {
    fs.readFile(fileLocation, function(err, data){
        if(err) {
            throw err
        }
        else {
            res.writeHead(200, {"Content-type": contentType})
            res.write(data)
            res.end()
        }
    })
}

function addTask(data, res) {
    getTasks(function(tasks) {
        tasks.push(data)
        writeTasksToFile(JSON.stringify(tasks)) 
        res.end()
    })    
}

function updateTask(number, res) {
    getTasks(function(tasks) {
        for(let i=0; i<tasks.length; i++) {
            if(tasks[i].number === number) {
                tasks[i].done = !tasks[i].done
                break
            }
        }
        writeTasksToFile(JSON.stringify(tasks)) 
        res.end()
    })
}

function removeTask(number, res) {
    getTasks(function(tasks) {
        for(let i=0; i<tasks.length; i++) {
            if(tasks[i].number === number) {
                tasks.splice(i, 1)
            }
        }
        writeTasksToFile(JSON.stringify(tasks)) 
        res.end()
    })  
}

function readPOSTData(req, res, callback) {
    let body = ""
    req.on("data", function(chunk) {
        body += chunk
    })
    req.on("end", function() {
        callback(JSON.parse(body), res)
    })
}

function getTasks(callback) {
    fs.readFile("files/storage/table_db.txt", function(err, data){
        if(err) {
            throw err
        }
        else {
            callback(JSON.parse(data))
        }
    })
}

function writeTasksToFile(data) {
    fs.writeFile("files/storage/table_db.txt", data, function(err){
        if(err) {
            throw err
        }
    })
}