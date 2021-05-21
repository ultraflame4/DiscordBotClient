const { ipcRenderer } = require('electron')



window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#botTokenLogin').addEventListener('click', () => {
        ipcRenderer.send("LoginRequest")
    })

    ipcRenderer.on("loggedin", () => {
        document.querySelector('#botTokenLogin').disabled=true;
    });


    ipcRenderer.on("botready",()=>{document.getElementById("botstatushere").textContent="Ready"})
    ipcRenderer.on("botname",(e,n)=>{document.getElementById("botnamehere").textContent=n})


})


document.addEventListener("keydown", function (e) {
    if (e.code==="F12") {
        ipcRenderer.send("devtools")
    }
});

