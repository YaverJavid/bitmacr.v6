function hexToRgbObject(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}


function getRandColor() {
    return `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`
}

function getQuadrant(arr, quadrant) {
    var rows = arr.length;
    var cols = arr[0].length;
    var midRow = Math.floor(rows / 2);
    var midCol = Math.floor(cols / 2);
    if (quadrant == 1) {
        return arr.slice(0, midRow).map(row => row.slice(0, midCol));
    } else if (quadrant == 2) {
        return arr.slice(0, midRow).map(row => row.slice(midCol));
    } else if (quadrant == 3) {
        return arr.slice(midRow).map(row => row.slice(0, midCol));
    } else if (quadrant == 4) {
        return arr.slice(midRow).map(row => row.slice(midCol));
    } else {
        return null;
    }
}

function squareArray(arr) {
    let size = Math.round(Math.sqrt(arr.length))
    var newArr = [];
    for (var i = 0; i < arr.length; i += size) {
        newArr.push(arr.slice(i, i + size));
    }
    return newArr;
}

function flip2DArrayVertically(arr) {
    var newArr = arr.slice();
    return newArr.reverse();
}

function flip2DArrayHorizontally(arr) {
    var newArr = arr.slice();
    return newArr.map(function(row) {
        return row.slice().reverse();
    });
}

function rgbToHex(str) {
    str = str.replace('rgb(', '').replace(')').split(',')
    let r = parseInt(str[0])
    let g = parseInt(str[1])
    let b = parseInt(str[2])
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}


function downloadCanvasAsImage(canvas, fileName = 'yj') {
    const dataUrl = canvas.toDataURL();
    const anchor = document.createElement('a');
    anchor.href = dataUrl;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

function downloadText(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

function matchNumbers(n1, n2, th){
    if(n1 == n2) return true
    let dn = Math.abs(n1 - n2)
    return dn < th
}

function matchHexColors(c1, c2, th){
    c1 = hexToRgbObject(c1)
    c2 = hexToRgbObject(c2)
    return (
        matchNumbers(c1.r, c2.r, th) &&
        matchNumbers(c1.g, c2.g ,th) &&
        matchNumbers(c1.b, c2.b, th)
        )
}


trimString = str => str.replace(/^\s+|\s+$/g, "");
verifyName = str => trimString(str).length > 0;

function hexToRgbaObject(hex) {
  let opacity = 1;
  if (hex.length === 9) {
    opacity = parseInt(hex.substring(7, 9), 16) / 255;
    hex = hex.substring(0, 7);
  }
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);

  return { r, g, b, a: opacity };
}

function colorObjectToRGBA(obj){
    return `rgb(${obj.r},${obj.g},${obj.b},${obj.a})`
}

function convertRGBAStrToObj(rgbaStr) {
  const rgbaArr = rgbaStr.match(/\d+/g).map(Number);
  return {r: rgbaArr[0], g: rgbaArr[1], b: rgbaArr[2], a: rgbaArr[3]};
}

function rotateArray90Degrees(matrix, clockwise = true) {
  const rows = matrix.length;
  const columns = matrix[0].length;
  const result = [];

  for (let i = 0; i < columns; i++) {
    result.push([]);
    for (let j = clockwise ? 0 : rows - 1; j >= 0 && j < rows; j += clockwise ? 1 : -1) {
      result[i].push(matrix[j][clockwise ? columns - i - 1 : i]);
    }
  }

  return result;
}
