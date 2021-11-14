import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, Platform, AlertController } from '@ionic/angular';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer, DocumentViewerOptions } from '@ionic-native/document-viewer/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Chooser } from '@ionic-native/chooser/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { HttpHeaders, HttpClient } from '@angular/common/http';

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
  openFrom = '';
  userID: number;
  files: any;
  selectedFileIndex: number = 1;

  constructor(
    public modal: ModalController,
    public alertC: AlertController,
    public navP: NavParams,
    public platform: Platform,
    public file: File,
    public ft: FileTransfer,
    public fileOpener: FileOpener,
    public filePath: FilePath,
    private http: HttpClient,
    public document: DocumentViewer,
    public chooser: Chooser,
    public toast: Toast) {
    this.openFrom = navP.get('openFrom');
    this.userID = navP.get('userID');
  }

  ngOnInit() {
    this.dropzone = document.getElementById('fileDropzone');
    this.dropzone.addEventListener("dragenter", e => this.dragEnter(e), false);
    this.dropzone.addEventListener("dragleave", e => this.dragLeave(e), false);
    this.dropzone.addEventListener("drop", e => this.dropped(e), false);
    this.dropzone.addEventListener("dragover", function (e) { e.preventDefault(); }, false);

    if (this.openFrom == 'internal') {
      let s1 = document.getElementById('openInternal');
      s1.style.display = 'block';
      let s2 = document.getElementById('openDatabase');
      s2.style.display = 'none';
      let s3 = document.getElementById('openDatabaseBtn');
      s3.style.display = 'none';
    }
    else if (this.openFrom == 'online') {
      let s1 = document.getElementById('openDatabase');
      s1.style.display = 'block';
      let s2 = document.getElementById('openInternal');
      s2.style.display = 'none';
      let s3 = document.getElementById('openDatabaseBtn');
      s3.style.display = 'block';
      this.loadOnlineFiles();
    }

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

  public selectedFile(id) {
    this.selectedFileIndex = id;
    for (let i = 0; i < this.files.length; i++) {
      if (this.files[i].id == this.selectedFileIndex) {
        this.chapFile = {
          name: this.files[i].name,
          data: this.files[i].data,
          dataUri: '',
          uri: '',
          mediaType: ''
        };
      }
    }
    console.log(this.chapFile);
  }

  async deleteFilePrompt() {
    const alert = await this.alertC.create({
      header: 'Are you sure you want to delete this file?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          this.deleteFile();
        }
      }, {
        text: 'No',
        role: 'cancel',
        handler: () => { }
      }]
    });
    await alert.present();
  }

  public deleteFile() {
    let userDetails = {
      userid: this.selectedFileIndex
    };

    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    this.http.post('http://www.chapprogramming.com/deleteFile.php', userDetails, {})
    // this.http.post('http://www.chapchap.ga/deleteFile.php', userDetails, {})
    // this.http.post('https://chapweb.000webhostapp.com/deleteFile.php', userDetails, {})
    // this.http.post('http://localhost:80/chap_2/deleteFile.php', userDetails, {})
      .map((res: any) => res)
      .subscribe(async res => {
        console.log(res);

        if (res.message == "File Deleted") {
          let alert = await this.alertC.create({
            header: "File Deleted!",
            message: "",
            buttons: ['OK']
          });
          alert.present();
          this.loadOnlineFiles();
        } else if (res.message == "No User ID session") {
          let alert = await this.alertC.create({
            header: "Delete Unsuccessful",
            message: "Please login again to perform this action.",
            buttons: ['OK']
          });
          alert.present();
        } else {

        }
      });
  }

  public loadOnlineFiles() {
    let userDetails = {
      userid: this.userID
    };

    var headers = new HttpHeaders();
    headers.append("Accept", 'application/json');
    headers.append('Content-Type', 'application/json');

    this.http.post('http://www.chapprogramming.com/getFiles.php', userDetails, {})
      //this.http.post('https://chapweb.000webhostapp.com/getFiles.php', userDetails, {})
      //this.http.post('http://localhost:80/chap_2/getFiles.php', userDetails, {})
      .map((res: any) => res)
      .subscribe(async res => {
        console.log(res);

        if (res.message == "Files Retrieved") {
          this.files = res.files;
        } else if (res.message == "No User ID session") {
          let alert = await this.alertC.create({
            header: "ERROR: Cannot retrieve CHAP Projects",
            message: "Please login again to perform this action.",
            buttons: ['OK']
          });
          alert.present();
        } else {

        }
      });
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
