import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-open-project',
  templateUrl: './open-project.page.html',
  styleUrls: ['./open-project.page.scss'],
})
export class OpenProjectPage implements OnInit {

  dropzone;
  chapFile;
  dropzoneText;

  constructor(public modal: ModalController, public navP: NavParams) { }

  ngOnInit() {
    this.dropzone = document.getElementById('fileDropzone');
    this.dropzone.addEventListener("dragenter", e => this.dragEnter(e), false);
    this.dropzone.addEventListener("dragleave", e => this.dragLeave(e), false);
    this.dropzone.addEventListener("drop", e => this.dropped(e), false);
    this.dropzone.addEventListener("dragover", function (e) { e.preventDefault(); }, false);

    this.dropzoneText = 'Drag your file here';
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

  public applyAndCloseModal() { this.modal.dismiss(this.chapFile); }

  public closeModal() { this.modal.dismiss(); }

}
