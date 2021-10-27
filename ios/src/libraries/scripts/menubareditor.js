var showingSourceCode = false;
var isInEditMode = true;

function enableEditMode(){
    editArea.document.designMode = 'On';
}

function toggleEditMode(){
    if(isInEditMode){
        editArea.document.designMode = 'Off';
        isInEditMode = false;
    } else {
        editArea.document.designMode = 'On';
        isInEditMode = true;
    }
}

function executeCommand(command){
    editArea.document.execCommand(command, false, null);
}

function execCommandWithArg(command, arg){
    editArea.document.execCommand(command, false, arg);
}

function toggleSource(){
    if(showingSourceCode){
        editArea.document.getElementsByTagName('body')[0].innerHTML =
        editArea.document.getElementsByTagName('body')[0].textContent;
        showingSourceCode = false;
    } else {
        editArea.document.getElementsByTagName('body')[0].textContent =
        editArea.document.getElementsByTagName('body')[0].innerHTML;
        showingSourceCode = true;
    }
}