function getRandomFontsString(fontsList, numFonts) {
    const selectedFonts = [];
  
    for (let i = 0; i < numFonts; i++) {
      const randomIndex = Math.floor(Math.random() * fontsList.length);
      selectedFonts.push(`"${fontsList[randomIndex]}"`);
    }
  
    return `[${selectedFonts.join(',')}]`;
  }
  
  // Example list of fonts
  const fontsList = [
    'Arial',
    'Segoe UI',
    'Helvetica',
    'Times New Roman',
    'Verdana',
    'Georgia',
    'Courier New',
    'Trebuchet MS'
  ];
  
  // Generate a random number between 3 and 7 (inclusive)
  const numRandomFonts = Math.floor(Math.random() * (7 - 3 + 1)) + 3;
  
  // Get the formatted string with random fonts
  const uwu = getRandomFontsString(fontsList, numRandomFonts);
  
  console.log(`${uwu}`);