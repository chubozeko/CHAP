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
    console.log("drag enter");
  }

  public dragLeave(e) {
    e.preventDefault();
    e.target.style.background = "#ddd";
    console.log("drag leave");
  }

  public dropped(e) {
    e.preventDefault();
    e.target.style.background = "#ddd";
    this.chapFile = e.dataTransfer.files[0];
    // let fr = new FileReader();
    // fr.readAsText(e.dataTransfer.files[0]);
    // fr.onloadend = (e) => {
    //   this.chapFile = fr.result;
    // };
    this.dropzoneText = '\'' + e.dataTransfer.files[0].name + '\' dropped!';
  }

  public applyAndCloseModal() { this.modal.dismiss(this.chapFile); }

  public closeModal() { this.modal.dismiss(); }

}
