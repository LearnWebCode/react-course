import React from "react"
import ReactDOMServer from "react-dom/server"
import fs from "fs"
import Footer from "./app/components/Footer"
import Header from "./app/components/Header"
import LoadingDotsIcon from "./app/components/LoadingDotsIcon"
import { StaticRouter as Router } from "react-router-dom/server"
import StateContext from "./app/StateContext"

function Shell() {
  return (
    <StateContext.Provider value={{ loggedIn: false }}>
      <Router>
        <Header staticEmpty={true} />
        <div className="py-5 my-5 text-center">
          <LoadingDotsIcon />
        </div>
        <Footer />
      </Router>
    </StateContext.Provider>
  )
}

const startOfHTML = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>OurApp</title>
      <link href="https://fonts.googleapis.com/css?family=Public+Sans:300,400,400i,700,700i&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous" />
      <script defer src="https://use.fontawesome.com/releases/v5.5.0/js/all.js" integrity="sha384-GqVMZRt5Gn7tB9D9q7ONtcp4gtHIUEW/yG7h98J7IpE3kpi+srfFyyB/04OV6pG0" crossorigin="anonymous"></script>
  
      <link rel="stylesheet" href="/main.css" />
    </head>
    <body>
      <div id="app">`

const endOfHTML = `</div>
    </body>
  </html>`

/* Use Node tools (outside the scope of this course) to setup a
  stream we can write to that saves to a file on our hard drive
*/
const fileName = "./app/index-template.html"
const writeStream = fs.createWriteStream(fileName)

// Add the start of our HTML template to the stream
writeStream.write(startOfHTML)

/*
  Add the actual React generated HTML to the stream.
  We can use ReactDomServer (you can see how we imported
  that at the very top of this file) to generate a string
  of HTML text that a Node stream can leverage.
*/
const myStream = ReactDOMServer.renderToPipeableStream(<Shell />, {
  onAllReady() {
    myStream.pipe(writeStream)
    // End the stream with the final bit of our HTML
    writeStream.end(endOfHTML)
  }
})
