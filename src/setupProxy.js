const {createProzyMiddleware} = require("http-proxy-middleware");

module.exports = app =>{
    app.use(
        createProzyMiddleware("/connect/token",{
            target: "https://localhost:44389/User/GetUsers",
            changeOrigin: true
        })
    )
}