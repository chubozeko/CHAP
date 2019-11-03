import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Chooser } from '@ionic-native/chooser/ngx';
import { Toast } from '@ionic-native/toast/ngx';

@Component({
  selector: 'app-open-project',
  templateUrl: './open-project.page.html',
  styleUrls: ['./open-project.page.scss'],
})
export class OpenProjectPage implements OnInit {

  dropzone;
  chapFile;
  dropzoneText = '';
  currentPlatform;

  constructor(
    public modal: ModalController,
    public navP: NavParams,
    public platform: Platform,
    public file: File,
    public ft: FileTransfer,
    public fileOpener: FileOpener,
    public filePath: FilePath,
    public document: DocumentViewer,
    public chooser: Chooser,
    public toast: Toast) {

  }

  ngOnInit() {
    this.dropzone = document.getElementById('fileDropzone');
    this.dropzone.addEventListener("dragenter", e => this.dragEnter(e), false);
    this.dropzone.addEventListener("dragleave", e => this.dragLeave(e), false);
    this.dropzone.addEventListener("drop", e => this.dropped(e), false);
    this.dropzone.addEventListener("dragover", function (e) { e.preventDefault(); }, false);

    if (this.platform.is("android")) { this.currentPlatform = 'android'; this.dropzoneText = ''; }
    else if (this.platform.is("ios")) { this.currentPlatform = 'ios'; this.dropzoneText = ''; }
    else if (this.platform.is("desktop")) { this.currentPlatform = 'desktop'; this.dropzoneText = 'Drag your file here'; }
  }

  public dragEnter(e) {
    e.preventDefault();
    e.target.style.background = "#9CDCFE";
    e.target.style.color = "#777777";
  }

  public dragLeave(e) {
    e.preventDefault();
    e.target.style.background = "#fff";
    e.target.style.color = "#777777";
  }

  public dropped(e) {
    e.preventDefault();
    e.target.style.background = "#fff";
    e.target.style.color = "#777777";
    e.target.style.fontSize = "18pt";

    let openFile = e.dataTransfer.files[0];
    console.log(openFile);

    let fr = new FileReader();
    fr.readAsText(openFile);
    fr.onloadend = () => {
      this.chapFile = {
        name: openFile.name,
        data: fr.result,
        dataUri: openFile.dataURI,
        uri: openFile.uri,
        mediaType: openFile.mediaType
      };

      this.dropzoneText = 'File Name: ' + this.chapFile.name + '\n';
      //this.dropzoneText += 'data: ' + this.chapFile.data + '\n';
    };
  }

  public openLocalChap() {
    this.chooser.getFile('*/*')
      .then(file => {
        let openFile = file;
        var str = String.fromCharCode.apply(null, openFile.data);

        this.chapFile = {
          name: openFile.name,
          data: str,
          dataUri: openFile.dataURI,
          uri: openFile.uri,
          mediaType: openFile.mediaType
        };

        this.dropzoneText = 'File Name: ' + this.chapFile.name + '\n';
        //this.dropzoneText += 'data: ' + this.chapFile.data + '\n';
      })
      .catch(e => console.log(e));
  }

  public applyAndCloseModal() { this.modal.dismiss(this.chapFile); }

  public closeModal() { this.modal.dismiss(); }

}
