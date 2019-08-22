import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
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
  }

  public dragLeave(e) {
    e.preventDefault();
    e.target.style.background = "#fff";
    e.target.style.color = "#ddd";
  }

  public dropped(e) {
    e.preventDefault();
    e.target.style.background = "#fff";
    e.target.style.color = "#333";
    e.target.style.fontSize = "12pt";

    this.chapFile = e.dataTransfer.files[0];
    this.dropzoneText = 'File Name: ' + this.chapFile.name + '\n';
    this.dropzoneText += 'Last Modified: ' + this.chapFile.lastModifiedDate + '\n';
    this.dropzoneText += 'File Size: ' + this.chapFile.size + ' bytes';
  }

  public openLocalChap() {
    this.chooser.getFile('*/*')
      .then(file => {
        this.chapFile = file;
        this.dropzoneText = 'File Name: ' + this.chapFile.name + '\n';
        this.dropzoneText += 'datauri: ' + file.dataURI + '\n';
      })
      .catch(e => console.log(e));
  }

  public applyAndCloseModal() { this.modal.dismiss(this.chapFile); }

  public closeModal() { this.modal.dismiss(); }

  /* File Opener Tutorial */
  // public openLocalChap() {
  //   let filePath = this.file.applicationDirectory + 'www/assets';

  //   if (this.platform.is('android')) {
  //     let fakeName = Date.now();
  //     this.file.copyFile(filePath, 'new2.chap', this.file.applicationDirectory, `${fakeName}.chap`)
  //       .then(result => {
  //         //this.fileOpener.open(result.nativeURL, 'application/chap');
  //         this.chapFile = result;
  //         console.log('Open ', result);
  //       });
  //   } else {
  //     const options: DocumentViewerOptions = {
  //       title: 'My CHAP'
  //     }
  //     //this.document.viewDocument(`${filePath}/new2.chap`, 'application/chap', options);
  //   }
  // }

  // public downloadAndOpenChap() {
  //   let downloadUrl = '';
  //   let path = this.file.dataDirectory;
  //   const transfer = this.ft.create();

  //   transfer.download(downloadUrl, `${path}myfile.chap`).then(entry => {
  //     let url = entry.toURL();

  //     if (this.platform.is('ios')) {
  //       this.document.viewDocument(url, 'application/chap', {});
  //     } else {
  //       this.fileOpener.open(url, 'application/chap');
  //     }
  //   });
  // }

}
