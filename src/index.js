const app = require('./app.js')
const port = process.env.PORT

app.get('/', function (req, res) {
    res.send('This is an API collection. Plese see <a href="https://github.com/aerdnach/task-man">github.com/aerdnach/task-man</a> for istruction about how to use it.');  
});

app.listen(port, () => {
    console.log('Server up and running on port ' + port)
})