var colors = [];
var total = 0;
window.onload = pokemon;

function pokemon() {
  loadCanvas();
  loadChart();
}

function loadCanvas() {
  Pixel.loadImage('images/pikachu.png').then(function(image) {
    new Pixel.Canvas('#canvas', image, image.width, image.height);

    canvas = document.querySelector('#canvas');
    context = canvas.getContext('2d');

    getColors(image, context);
  }, function(err) {
    console.log('Err:', err);
  });
}

function getColors(image, context) {
  var colorhash = {};

  for(var i=0; i<image.width; i++) {
    for(var j=0; j<image.height; j++) {
      var rgba = context.getImageData(i, j, 1, 1).data;
      var color = rgbaToHex(rgba);

      // ignore other colors
      if(rgba[3] === 0) // alpha = 0
        continue;

      if(color === 'ffffff')
        continue;

      if(colorhash[color] === undefined)
        colorhash[color] = 1;
      else
        colorhash[color]++;

      total++;
    }
  }

  for(var key in colorhash) {
    colors.push(['#'+key, colorhash[key]]);
  }

  colors.sort(function(a,b) {
    return a[1] > b[1];
  });
}


function rgbaToHex(rgba) {
  return componentToHex(rgba[0]) +
         componentToHex(rgba[1]) +
         componentToHex(rgba[2]);
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function loadChart() {
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
}

function drawChart() {
  var colorArr = [];
  colorArr.push(['Color', 'Quantity']);
  colorArr = colorArr.concat(colors);

  for(var i in colors) {
    var x = colors[i];
  }

  var data = google.visualization.arrayToDataTable(colorArr);

  var colorValues = colors.map(function(x) {
    return x[0];
  });

  var options = {
    colors: colorValues,
    legend: 'none',
    pieResidueSliceColor: colorValues[colorValues.length-1],
    // pieResidueSliceColor: 'transparent',
    pieSliceBorderColor: 'transparent',
    pieSliceText: 'none',
    sliceVisibilityThreshold: .01,
    text: '',
    title: 'Pokemon',
  };

  var chart = new google.visualization.PieChart(document.getElementById('piechart'));

  chart.draw(data, options);
}
