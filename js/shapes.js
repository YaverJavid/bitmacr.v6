function drawCircle(centerX, centerY, radius, grid, filled = false) {
  // Iterate through each cell of the grid
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      // Calculate the distance between the current cell and the center of the circle
      const distance = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
      
      // Check if the current cell is within the circle
      if (distance <= radius) {
        // If the circle is filled or if the current cell lies on the circumference
        if (filled || Math.abs(distance - radius) < 1) {
          grid[i][j].style.backgroundColor = getCurrentSelectedColor();
        }
      }
    }
  }
}


