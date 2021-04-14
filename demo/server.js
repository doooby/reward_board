const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/assets/*', (req, res) => {
    const file = path.resolve(__dirname, '../tmp/build', req.params[0]);
    if (fs.existsSync(file)) {
        res.sendFile(file);
    } else {
        res.status(404).end();
    }
});

app.listen(port, () => {
   console.log(`started on http://localhost:${port}`);
});
