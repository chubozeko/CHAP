var leftbox, code;
var shapes = [];

function doFirst(){
    leftbox = document.getElementById('inner-dropzone');
    leftbox.addEventListener("dragenter", dragEnter, false);
    leftbox.addEventListener("dragleave", dragLeave, false);
    leftbox.addEventListener("dragover", function(e){e.preventDefault();}, false);
    leftbox.addEventListener("drop", dropped, false);
  
    shapes[0] = document.getElementById('s_start_stop');
    shapes[1] = document.getElementById('s_input');
    shapes[2] = document.getElementById('s_output');
    shapes[3] = document.getElementById('s_process');
    shapes[4] = document.getElementById('s_decision');

    for(var i=0; i<5; i++){
        shapes[i].addEventListener("dragstart", startDrag, false);
        shapes[i].addEventListener("dragend", endDrag, false);
    }
    
  }
  
  function startDrag(e){
    code = e.target.outerHTML;
    e.dataTransfer.setData('text', code);
  }
  
  // To prevent dublicating the image in leftbox
  function endDrag(e){
    pic = e.target;
    leftbox.style.background = "#ddd";
    leftbox.style.border = "0";
  }
  
  function deleteShape(){
    mypic = document.getElementById('facepic');
    mypic.style.display = 'none';
  }
  
  function dragEnter(e){
    e.preventDefault();
    leftbox.style.background = "#333";
    leftbox.style.border = "1px dashed SkyBlue";
  }
  
  function dragLeave(e){
    e.preventDefault();
    leftbox.style.background = "#ddd";
    leftbox.style.border = "0";
  }
  
  function dropped(e){
    e.preventDefault();
    leftbox.style.background = "#ddd";
    leftbox.style.border = "0";
    leftbox.innerHTML = e.dataTransfer.getData('text');
  }
  
  window.addEventListener("load", doFirst, false);
  