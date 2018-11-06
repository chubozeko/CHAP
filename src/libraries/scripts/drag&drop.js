var leftbox, code, branch, workspace;
var shapes = [];


function doFirst(){

  this.workspace = document.getElementById("workspace");
  this.branch = document.getElementById("arrow");

    leftbox = document.getElementsByClassName('dropzone');
    for(let i=0; i<leftbox.length; i++){
      leftbox[i].addEventListener("dragenter", dragEnter, false);
      leftbox[i].addEventListener("dragleave", dragLeave, false);
      leftbox[i].addEventListener("dragover", function(e){e.preventDefault();}, false);
      leftbox[i].addEventListener("drop", dropped, false);
      
      //leftbox[i].addEventListener("touchcancel", handleCancel, false);
      //leftbox[i].addEventListener("touchleave", dragLeave, false);
      //leftbox[i].addEventListener("touchmove", handleMove, false);

    }
    
    shapes = document.getElementsByClassName('symbol');
    for(var i=0; i<shapes.length; i++){
      shapes[i].addEventListener("dragstart", startDrag, false);
      shapes[i].addEventListener("dragend", endDrag, false);
      shapes[i].addEventListener("touchstart", startDrag, false);
      shapes[i].addEventListener("touchend", endDrag, false);
    }
    
  }
  
  function startDrag(e){
    code = e.target.id;
    e.dataTransfer.setData('id', code);
    console.log('start drag' + code);
  }
  
  // To prevent dublicating the image in leftbox
  function endDrag(e){
    //pic = e.target;
    console.log('end drag');
  }
  
  function deleteShape(){
    mypic = document.getElementById('facepic');
    mypic.style.display = 'none';
  }
  
  function dragEnter(e){
    e.preventDefault();
    e.target.classList.add('active-arrow');
    e.target.style.background = "#9CDCFE";
    console.log('drag enter');
  }
  
  function dragLeave(e){
    e.preventDefault();
    e.target.classList.remove('active-arrow');
    e.target.style.background = "#000000";
    console.log('drag leave');
  }
  
  function dropped(e){
    e.preventDefault();
    e.target.style.background = "#000000";
    addSymbol(code, e);
    console.log('dropped');
  }

  function addSymbol(id, event){

    let symClass, temp, symbol;
    if(id == 's_if_case'){
      symClass = "if_div";
      temp = document.getElementsByClassName(symClass);
      symbol = temp[0].cloneNode(true);
    } else if(id == 's_for_loop'){
      symClass = "for_div";
      temp = document.getElementsByClassName(symClass);
      symbol = temp[0].cloneNode(true);
    } else if(id == 's_while_loop'){
      symClass = "while_div";
      temp = document.getElementsByClassName(symClass);
      symbol = temp[0].cloneNode(true);
    } else if(id == 's_do_while_loop'){
      symClass = "do_while_div";
      temp = document.getElementsByClassName(symClass);
      symbol = temp[0].cloneNode(true);
    } else {
      temp = document.getElementById(id);
      symbol = temp.cloneNode(true);
      symbol.textContent = "";
    }

    // Get and create a new symbol with given id from symbols FAB

    // Get the selected arrow/branch to append symbol after
    let branches = document.getElementsByClassName("arrow dropzone active-arrow");
    let tempBranch = this.branch.cloneNode(true);
    
    // Add buttonClick listeners to new Symbol & Arrow/Branch
    tempBranch.addEventListener('click', (e) => this.openSymbolsFAB(e) );   
    tempBranch.addEventListener("dragenter", dragEnter, false);
    tempBranch.addEventListener("dragleave", dragLeave, false);
    tempBranch.addEventListener("dragover", function(e){e.preventDefault();}, false);
    tempBranch.addEventListener("drop", dropped, false);

    symbol.addEventListener('dblclick', (e) => this.openSymbolsAS(e) );

    // Add symbol and corresponding arrow/branch to Workspace
    this.workspace.insertBefore(symbol, branches[0].nextSibling);
    this.workspace.insertBefore(tempBranch, symbol.nextSibling);

    // Make all the arrows/branches on the Workspace inactive
    branches = document.getElementsByClassName("arrow dropzone active-arrow");
    for(let i=0; i<branches.length; i++){
      branches[i].classList.remove('active-arrow');
    }

  }
  
  window.addEventListener("load", doFirst, false);
  