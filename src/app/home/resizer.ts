export class Resizer {

  constructor() {}

  public resizeSymbols(symbol) {
    if (
      symbol.parentElement.parentElement.classList.contains("if_div") ||
      symbol.parentElement.classList.contains("if_div")
    ) {
      this.resizeIfCaseBlocks(symbol);
    } else if (
      symbol.parentElement.parentElement.classList.contains("for_div") ||
      symbol.parentElement.classList.contains("for_div")
    ) {
      this.resizeForLoopBlocks(symbol);
    } else if (
      symbol.parentElement.parentElement.classList.contains("while_div") ||
      symbol.parentElement.classList.contains("while_div")
    ) {
      this.resizeWhileLoopBlocks(symbol);
    } else if (
      symbol.parentElement.parentElement.classList.contains("do_while_div") ||
      symbol.parentElement.classList.contains("do_while_div")
    ) {
      this.resizeDoWhileLoopBlocks(symbol);
    }
  }

  resizeIfCaseBlocks(symbol) {
    // If Case Symbols
    if (symbol.parentElement.parentElement.classList.contains("if_div")) {
      if (symbol.parentElement.id == "ifTrueBlock" || symbol.parentElement.id == "ifFalseBlock") {
        let ifDiv = symbol.parentElement.parentElement as HTMLDivElement;
        let ifSymbol = ifDiv.getElementsByClassName("if_sym")[0] as HTMLDivElement;
        let falseBlock = ifDiv.getElementsByClassName("ifFalseBlock")[0] as HTMLDivElement;
        let trueBlock = ifDiv.getElementsByClassName("ifTrueBlock")[0] as HTMLDivElement;
        // Resize to the Block with the larger width
        let gridStr: string = "";
        if (trueBlock.offsetWidth > falseBlock.offsetWidth) {
          gridStr = trueBlock.offsetWidth + "px max-content " +
            ifSymbol.offsetWidth + "px max-content " + trueBlock.offsetWidth + "px";
          ifDiv.style.gridTemplateColumns = gridStr;
          trueBlock.style.margin = "0px";
          falseBlock.style.margin = "auto";
        } else if (falseBlock.offsetWidth > trueBlock.offsetWidth) {
          gridStr = falseBlock.offsetWidth + "px max-content " + 
            ifSymbol.offsetWidth + "px max-content " + falseBlock.offsetWidth + "px";
          ifDiv.style.gridTemplateColumns = gridStr;
          trueBlock.style.margin = "auto";
          falseBlock.style.margin = "0px";
        } else {
          gridStr = falseBlock.offsetWidth + "px max-content " +
            ifSymbol.offsetWidth + "px max-content " + trueBlock.offsetWidth + "px";
          ifDiv.style.gridTemplateColumns = gridStr;
          trueBlock.style.margin = "0px";
          falseBlock.style.margin = "0px";
        }
      }
      this.resizeIfCaseArrows(symbol.parentElement, true);
    } else if (symbol.parentElement.classList.contains("if_div")) {
      // If Symbol
      let ifDiv = symbol.parentElement as HTMLDivElement;
      let falseBlock = ifDiv.getElementsByClassName("ifFalseBlock")[0] as HTMLDivElement;
      let trueBlock = ifDiv.getElementsByClassName("ifTrueBlock")[0] as HTMLDivElement;
      let gridStr = "";
      if (trueBlock.offsetWidth > falseBlock.offsetWidth) {
        gridStr = trueBlock.offsetWidth + "px max-content " +
          symbol.offsetWidth + "px max-content " + trueBlock.offsetWidth + "px";
      } else if (trueBlock.offsetWidth < falseBlock.offsetWidth) {
        gridStr = falseBlock.offsetWidth + "px max-content " +
          symbol.offsetWidth + "px max-content " + falseBlock.offsetWidth + "px";
      } else {
        gridStr = falseBlock.offsetWidth + "px max-content " +
          symbol.offsetWidth + "px max-content " + trueBlock.offsetWidth + "px";
      }
      ifDiv.style.gridTemplateColumns = gridStr;
      symbol.style.margin = "0px";
      this.resizeIfCaseArrows(symbol, false);
    }
  }

  resizeForLoopBlocks(symbol) {
    // For Loop Symbols
    if (symbol.parentElement.parentElement.classList.contains("for_div")) {
      if (symbol.parentElement.id == "forTrueBlock" || symbol.parentElement.id == "forFalseBlock") {
        let forDiv = symbol.parentElement.parentElement as HTMLDivElement;
        let forSymbol = forDiv.getElementsByClassName("for_sym")[0] as HTMLDivElement;
        let falseBlock = forDiv.getElementsByClassName("forFalseBlock")[0] as HTMLDivElement;
        let trueBlock = forDiv.getElementsByClassName("forTrueBlock")[0] as HTMLDivElement;
        // Resize to the Block with the larger width
        let gridStr: string = "";
        gridStr = trueBlock.offsetWidth + "px max-content " +
          forSymbol.offsetWidth + "px max-content " + trueBlock.offsetWidth + "px";
        forDiv.style.gridTemplateColumns = gridStr;
        trueBlock.style.margin = "0px";
        falseBlock.style.margin = "0px";
      }
      this.resizeForLoopArrows(symbol.parentElement, true);
    } else if (symbol.parentElement.classList.contains("for_div")) {
      // For Symbol
      let forDiv = symbol.parentElement as HTMLDivElement;
      let falseBlock = forDiv.getElementsByClassName("forFalseBlock")[0] as HTMLDivElement;
      let trueBlock = forDiv.getElementsByClassName("forTrueBlock")[0] as HTMLDivElement;
      let gridStr = "";
      gridStr = trueBlock.offsetWidth + "px max-content " +
        symbol.offsetWidth + "px max-content " + trueBlock.offsetWidth + "auto";
      forDiv.style.gridTemplateColumns = gridStr;
      symbol.style.margin = "auto";
      symbol.style.clipPath = "polygon(" + (symbol.offsetWidth - 17.5) +
        "px 0, 100% 17.5px, 100% 100%, 0 100%, 0 17.5px, 17.5px 0)";
      symbol.style.webkitClipPath = "polygon(" + (symbol.offsetWidth - 17.5) +
        "px 0, 100% 17.5px, 100% 100%, 0 100%, 0 17.5px, 17.5px 0)";
      this.resizeForLoopArrows(symbol.parentElement, false);
    }
  }

  resizeWhileLoopBlocks(symbol) {
    // While Loop Symbols
    if (symbol.parentElement.parentElement.classList.contains("while_div")) {
      if (symbol.parentElement.id == "whileTrueBlock") {
        let whileDiv = symbol.parentElement.parentElement as HTMLDivElement;
        let whileSymbol = whileDiv.getElementsByClassName("while_sym")[0] as HTMLDivElement;
        let falseBlock = whileDiv.getElementsByClassName("whileFalseBlock")[0] as HTMLDivElement;
        let trueBlock = whileDiv.getElementsByClassName("whileTrueBlock")[0] as HTMLDivElement;
        // Resize to the Block with the larger width
        let gridStr: string = "";
        gridStr = trueBlock.offsetWidth + "px max-content " +
          whileSymbol.offsetWidth + "px max-content " + trueBlock.offsetWidth + "px";
        whileDiv.style.gridTemplateColumns = gridStr;
        trueBlock.style.margin = "0px";
        falseBlock.style.margin = "0px";
      }
      this.resizeWhileLoopArrows(symbol.parentElement, true);
    } else if (symbol.parentElement.classList.contains("while_div")) {
      // While Symbol
      let whileDiv = symbol.parentElement as HTMLDivElement;
      let falseBlock = whileDiv.getElementsByClassName("whileFalseBlock")[0] as HTMLDivElement;
      let trueBlock = whileDiv.getElementsByClassName("whileTrueBlock")[0] as HTMLDivElement;
      let gridStr = "";
      gridStr = trueBlock.offsetWidth + "px max-content " +
        symbol.offsetWidth + "px max-content " + trueBlock.offsetWidth + "auto";
      whileDiv.style.gridTemplateColumns = gridStr;
      symbol.style.margin = "auto";
      symbol.style.clipPath = "polygon(" + (symbol.offsetWidth - 17.5) +
        "px 0, 100% 17.5px, 100% 100%, 0 100%, 0 17.5px, 17.5px 0)";
      symbol.style.webkitClipPath = "polygon(" + (symbol.offsetWidth - 17.5) +
        "px 0, 100% 17.5px, 100% 100%, 0 100%, 0 17.5px, 17.5px 0)";
      this.resizeWhileLoopArrows(symbol.parentElement, false);
    }
  }

  resizeDoWhileLoopBlocks(symbol) {
    // Do While Loop Symbols
    if (symbol.parentElement.parentElement.classList.contains("do_while_div")) {
      if (symbol.parentElement.id == "doWhileTrueBlock") {
        let doWhileDiv = symbol.parentElement.parentElement as HTMLDivElement;
        let doWhileSymbol = doWhileDiv.getElementsByClassName("do_while_sym")[0] as HTMLDivElement;
        let falseBlock = doWhileDiv.getElementsByClassName("doWhileFalseBlock")[0] as HTMLDivElement;
        let trueBlock = doWhileDiv.getElementsByClassName("doWhileTrueBlock")[0] as HTMLDivElement;
        // Resize to the Block with the larger width
        let gridStr: string = "";
        gridStr = trueBlock.offsetWidth + "px max-content " +
          doWhileSymbol.offsetWidth + "px max-content " + trueBlock.offsetWidth + "px";
        doWhileDiv.style.gridTemplateColumns = gridStr;
        trueBlock.style.margin = "0px";
        falseBlock.style.margin = "0px";
      }
      this.resizeDoWhileLoopArrows(symbol.parentElement, true);
    } else if (symbol.parentElement.classList.contains("do_while_div")) {
      // Do While Symbol
      let doWhileDiv = symbol.parentElement as HTMLDivElement;
      let falseBlock = doWhileDiv.getElementsByClassName("doWhileFalseBlock")[0] as HTMLDivElement;
      let trueBlock = doWhileDiv.getElementsByClassName("doWhileTrueBlock")[0] as HTMLDivElement;
      let gridStr = "";
      gridStr = trueBlock.offsetWidth + "px max-content " +
        symbol.offsetWidth + "px max-content " + trueBlock.offsetWidth + "auto";
      doWhileDiv.style.gridTemplateColumns = gridStr;
      symbol.style.margin = "auto";
      symbol.style.clipPath = "polygon(" + (symbol.offsetWidth - 17.5) +
        "px 0, 100% 17.5px, 100% 100%, 0 100%, 0 17.5px, 17.5px 0)";
      symbol.style.webkitClipPath = "polygon(" + (symbol.offsetWidth - 17.5) +
        "px 0, 100% 17.5px, 100% 100%, 0 100%, 0 17.5px, 17.5px 0)";
      this.resizeDoWhileLoopArrows(symbol.parentElement, false);
    }
  }

  resizeIfCaseArrows(symbol, resizeBlocks: boolean) {
    // If Case Symbols
    if (resizeBlocks) {
      // Resize arrows to the Left and Right
      let ifDiv = symbol.parentElement as HTMLDivElement;
      let leftArrowPieces = ifDiv.getElementsByClassName("arrowPiece left");
      for (let i = 0; i < leftArrowPieces.length; i++) {
        let aPiece = leftArrowPieces[i] as HTMLDivElement;
        let gridStr = "";
        let z = aPiece.offsetWidth / 2 - 35 / 2;
        gridStr = z + "px 35px " + z + "px";
        aPiece.style.gridTemplateColumns = gridStr;
        let arrowP = aPiece.getElementsByClassName("dropzone");
        for (let j = 0; j < arrowP.length; j++) {
          let p = arrowP[j] as HTMLDivElement;
          p.style.width = z + "px";
        }
      }
      let rightArrowPieces = ifDiv.getElementsByClassName("arrowPiece right");
      for (let i = 0; i < rightArrowPieces.length; i++) {
        let aPiece = rightArrowPieces[i] as HTMLDivElement;
        let gridStr = "";
        let z = aPiece.offsetWidth / 2 - 35 / 2;
        gridStr = z + "px 35px " + z + "px";
        aPiece.style.gridTemplateColumns = gridStr;
        let arrowP = aPiece.getElementsByClassName("dropzone");
        for (let j = 0; j < arrowP.length; j++) {
          let p = arrowP[j] as HTMLDivElement;
          p.style.width = z + "px";
        }
      }
    } else {
      // Resize arrows below If Symbol
      let ifDiv = symbol.parentElement as HTMLDivElement;
      let arrowPiece = ifDiv.getElementsByClassName("arrowPiece bottom_center")[0] as HTMLDivElement;
      let gridStr = "";
      let z = arrowPiece.offsetWidth / 2 - 35 / 2;
      gridStr = z + "px 35px " + z + "px";
      arrowPiece.style.gridTemplateColumns = gridStr;
      let right1 = arrowPiece.getElementsByClassName("arrow_right")[0] as HTMLDivElement;
      let left1 = arrowPiece.getElementsByClassName("arrow_left")[0] as HTMLDivElement;
      right1.style.width = z + "px";
      left1.style.width = z + "px";
    }
  }

  resizeForLoopArrows(symbol, resizeBlocks: boolean) {
    // For Loop Symbols
    if (resizeBlocks) {
      // Resize arrows to the Left and Right
      let forDiv = symbol.parentElement as HTMLDivElement;
      let rightArrowPieces = forDiv.getElementsByClassName("arrowPiece right");
      for (let i = 0; i < rightArrowPieces.length; i++) {
        let aPiece = rightArrowPieces[i] as HTMLDivElement;
        let gridStr = "";
        let z = aPiece.offsetWidth / 2 - 35 / 2;
        gridStr = z + "px 35px " + z + "px";
        aPiece.style.gridTemplateColumns = gridStr;
        let arrowP = aPiece.getElementsByClassName("dropzone");
        for (let j = 0; j < arrowP.length; j++) {
          let p = arrowP[j] as HTMLDivElement;
          p.style.width = z + "px";
        }
      }
    } else {
      // Resize arrows below For Symbol
      let forDiv = symbol.parentElement as HTMLDivElement;
      let arrowPiece = forDiv.getElementsByClassName("arrowPiece bottom_center")[0] as HTMLDivElement;
      let gridStr = "";
      let z = arrowPiece.offsetWidth / 2 - 70 / 2;
      gridStr = z + "px 70px " + z + "px";
      arrowPiece.style.gridTemplateColumns = gridStr;
      let right1 = arrowPiece.getElementsByClassName("arrow_horizontal")[0] as HTMLDivElement;
      let left1 = arrowPiece.getElementsByClassName("blank_arrow_left")[0] as HTMLDivElement;
      right1.style.width = z + "px";
      left1.style.width = z + "px";
    }
  }

  resizeWhileLoopArrows(symbol, resizeBlocks: boolean) {
    // While Loop Symbols
    if (resizeBlocks) {
      // Resize arrows to the Left and Right
      let whileDiv = symbol.parentElement as HTMLDivElement;
      let rightArrowPieces = whileDiv.getElementsByClassName("arrowPiece right");
      for (let i = 0; i < rightArrowPieces.length; i++) {
        let aPiece = rightArrowPieces[i] as HTMLDivElement;
        let gridStr = "";
        let z = aPiece.offsetWidth / 2 - 35 / 2;
        gridStr = z + "px 35px " + z + "px";
        aPiece.style.gridTemplateColumns = gridStr;
        let arrowP = aPiece.getElementsByClassName("dropzone");
        for (let j = 0; j < arrowP.length; j++) {
          let p = arrowP[j] as HTMLDivElement;
          p.style.width = z + "px";
        }
      }
    } else {
      // Resize arrows below While Symbol
      let whileDiv = symbol.parentElement as HTMLDivElement;
      let arrowPiece = whileDiv.getElementsByClassName("arrowPiece bottom_center")[0] as HTMLDivElement;
      let gridStr = "";
      let z = arrowPiece.offsetWidth / 2 - 70 / 2;
      gridStr = z + "px 70px " + z + "px";
      arrowPiece.style.gridTemplateColumns = gridStr;
      let right1 = arrowPiece.getElementsByClassName("arrow_horizontal")[0] as HTMLDivElement;
      let left1 = arrowPiece.getElementsByClassName("blank_arrow_left")[0] as HTMLDivElement;
      right1.style.width = z + "px";
      left1.style.width = z + "px";
    }
  }

  resizeDoWhileLoopArrows(symbol, resizeBlocks: boolean) {
    // Do Loop Symbols
    if (resizeBlocks) {
      // Resize arrows to the Left and Right
      let doWhileDiv = symbol.parentElement as HTMLDivElement;
      let rightArrowPieces = doWhileDiv.getElementsByClassName("arrowPiece right");
      for (let i = 0; i < rightArrowPieces.length; i++) {
        let aPiece = rightArrowPieces[i] as HTMLDivElement;
        let gridStr = "";
        let z = aPiece.offsetWidth / 2 - 35 / 2;
        gridStr = z + "px 35px " + z + "px";
        aPiece.style.gridTemplateColumns = gridStr;
        let arrowP = aPiece.getElementsByClassName("dropzone");
        for (let j = 0; j < arrowP.length; j++) {
          let p = arrowP[j] as HTMLDivElement;
          p.style.width = z + "px";
        }
      }
    } else {
      // Resize arrows below Do While Symbol
      let doWhileDiv = symbol.parentElement as HTMLDivElement;
      let arrowPiece = doWhileDiv.getElementsByClassName("arrowPiece bottom_center")[0] as HTMLDivElement;
      let gridStr = "";
      let z = arrowPiece.offsetWidth / 2 - 35 / 2;
      gridStr = z + "px 35px " + z + "px";
      arrowPiece.style.gridTemplateColumns = gridStr;
      let right1 = arrowPiece.getElementsByClassName("arrow_horizontal")[0] as HTMLDivElement;
      let left1 = arrowPiece.getElementsByClassName("blank_arrow_left")[0] as HTMLDivElement;
      right1.style.width = z + "px";
      left1.style.width = z + "px";
    }
  }

}