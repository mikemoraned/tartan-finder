import express from 'express';
import Canvas from 'canvas';
import tartan from 'tartan';
import 'tartan-schema';
import 'tartan-processing';
import 'tartan-render';

const schema = tartan.schema.extended;

function errorHandler(error, data, severity) {
    console.log(error, data, severity);
}

const parse = schema.parse({
    errorHandler: errorHandler,
    transformSyntaxTree: tartan.transform.optimize()
});

const format = schema.format({
    defaultColors: schema.colors,
    includeUnusedColors: false,
    includeDefaultColors: true
});

const app = express();

app.get('/sett.png', function (req, res) {
    const sett = parse('K30 B24 K6 B6 K6 B24 K30 G4');
    const dimensions = {
        width: 500,
        height: 500
    };
    const canvas = new Canvas(dimensions.width, dimensions.height);

    const render = tartan.render.canvas(sett, {
        defaultColors: schema.colors,
        transformSyntaxTree: tartan.transform.flatten()
    });

    render(canvas, { x: 0, y: 0});

    res.writeHead(200, {'Content-Type': 'image/png' });
    res.end(canvas.toBuffer(), 'binary');
});

const port = process.argv[2];
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
