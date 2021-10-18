import { MenuController, ActionSheetController, AlertController, NavController, Platform } from "@ionic/angular";
import { File } from "@ionic-native/file/ngx";
import { Toast } from "@ionic-native/toast/ngx";
import { AuthService } from "../auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Flowchart } from "../classes/Flowchart";

export class Saver {

  saveFolder = "CHAP Project Files";

  constructor(
    
    public alertC: AlertController,
    public arrowsOptionsAS: ActionSheetController,
    private auth: AuthService,
    private file: File,
    private http: HttpClient,
    public menu: MenuController,
    public navCtrl: NavController,
    public toast: Toast
  ) {
  }

  public saveProject(fileName, flowchart: Flowchart, platform: Platform) {
    let flowchartJSON;
    // this.menu.close();
    let fName = document.getElementById("fileName") as HTMLInputElement;
    fileName = fName.value;

    if (fileName == "") {
      this.showAlert(
        "Failed to Save",
        `Please enter a name for the project in the TextBox above, before saving it.`
      );
    } else {
      fileName += ".chap";
      flowchart.prepareFlowchartForSaving();
      flowchartJSON = JSON.stringify(flowchart.SYMBOLS);

      if (platform.is("android")) {
        this.saveToAndroid(flowchartJSON, fileName);
      } else if (platform.is("ios")) {
        this.saveToIOS(flowchartJSON, fileName);
      } else if (platform.is("desktop")) {
        this.saveTextAsFile(flowchartJSON, fileName);
      }
    }
  }

  public saveTextAsFile(data, filename) {
    if (!data) {
      console.error("Console.save: No data");
      return;
    }
    if (!filename) filename = "console.json";
    var blob = new Blob([data], { type: "text/plain" }),
      e = document.createEvent("MouseEvents"),
      a = document.createElement("a");

    console.log("base64:", btoa(data));

    var e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = filename;
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/plain", a.download, a.href].join(":");
      e.initEvent("click", true, false);
      a.dispatchEvent(e);

      console.log("A link", a.href);
  }

  public saveToAndroid(fileData, filename) {
    this.file
      .writeFile(
        `${this.file.externalRootDirectory}/${this.saveFolder}`,
        `${filename}`,
        fileData,
        { replace: true, append: false }
      )
      .then((res) => {
        this.toast
          .show(
            'The project "' + filename + '" has successfully saved.',
            "3000",
            "bottom"
          )
          .subscribe((toast) => {
            console.log(toast);
          });
      });
  }

  public saveToIOS(flowchartJSON, filename) { }

  async saveProjectToDatabase(fileName, flowchart: Flowchart, platform: Platform) {
    // Check if it is in Offline Mode
    if (this.auth.mode == "offline") {
      let alert = await this.alertC.create({
        header: "Offline Mode",
        message: "Please turn on your internet connection to use CHAP online.",
        buttons: [
          {
            text: "Go Online",
            handler: () => {
              //this.auth.mode = 'online';
              this.navCtrl.navigateRoot("/login");
            },
          },
          {
            text: "Close",
            role: "cancel",
            handler: () => { },
          },
        ],
      });
      alert.present();
    } else if (this.auth.isLoggedIn) {
      let flowchartJSON;

      let fName = document.getElementById("fileName") as HTMLInputElement;
      fileName = fName.value;

      if (fileName == "") {
        this.showAlert(
          "Failed to Save",
          `Please enter a name for the project in the TextBox above, before saving it.`
        );
      } else {
        fileName += ".chap";
        flowchart.prepareFlowchartForSaving();
        flowchartJSON = JSON.stringify(flowchart.SYMBOLS);

        let uploadFile = {
          userid: this.auth.sessionToken.session.user_id,
          name: fileName,
          type: "text/plain",
          blob: flowchartJSON,
        };
        console.log("upload data", uploadFile);

        var headers = new HttpHeaders();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");

        this.http.post("http://www.chapprogramming.com/saveProject.php", uploadFile, {})
        // this.http.post("http://www.chapchap.ga/saveProject.php", uploadFile, {})
        // this.http.post('https://chapweb.000webhostapp.com/saveProject.php', uploadFile, {})
        // this.http.post('http://localhost:80/chap_2/saveProject.php', uploadFile, {})
          .map((res: any) => res)
          .subscribe(async (res) => {
            console.log(res);

            if (res.message == "Save successful") {
              if (platform.is("android") || platform.is("ios")) {
                this.toast
                  .show("Save successful!.", "3000", "bottom")
                  .subscribe((toast) => {
                    console.log(toast);
                  });
              } else {
                let alert = await this.alertC.create({
                  header: "File Uploaded to database",
                  message: "Save successful",
                  buttons: ["OK"],
                });
                alert.present();
              }
            } else if (
              res.message == "Invaild File Upload! Please Re-Check your File."
            ) {
              if (platform.is("android") || platform.is("ios")) {
                this.toast
                  .show(
                    "Invaild File Upload! Please Re-Check your File.",
                    "3000",
                    "bottom"
                  )
                  .subscribe((toast) => {
                    console.log(toast);
                  });
              } else {
                let alert = await this.alertC.create({
                  header: "ERROR",
                  message: "Invaild File Upload! Please Re-Check your File.",
                  buttons: ["OK"],
                });
                alert.present();
              }
            } else {
              if (platform.is("android") || platform.is("ios")) {
                this.toast
                  .show(res.message, "3000", "bottom")
                  .subscribe((toast) => {
                    console.log(toast);
                  });
              } else {
                let alert = await this.alertC.create({
                  header: "ERROR",
                  message: res.message,
                  buttons: ["OK"],
                });
                alert.present();
              }
            }
          });
      }
    } else {
      let alert = await this.alertC.create({
        header: "Cannot Save Online",
        message: "Please log in to save your CHAP projects online.",
        buttons: [
          {
            text: "Login",
            handler: () => {
              //this.auth.mode = 'online';
              this.navCtrl.navigateRoot("/login");
            },
          },
          {
            text: "Use Offline Mode",
            role: "cancel",
            handler: () => { },
          },
        ],
      });
      alert.present();
    }
  }

  public saveAsImageFile(data, filename) {
    if (!data) {
      console.error("Console.save: No data");
      return;
    }
    if (!filename) filename = "temp.png";
    var blob = new Blob([data], { type: "image/png" }),
      e = document.createEvent("MouseEvents"),
      a = document.createElement("a");

    var e = document.createEvent("MouseEvents"),
    a = document.createElement("a");
    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["image/png", a.download, a.href].join(":");
    e.initEvent("click", true, false);
    a.dispatchEvent(e);
  }

  async showAlert(alertTitle: string, alertMsg: string) {
    const alert = await this.alertC.create({
      header: alertTitle,
      message: alertMsg,
      buttons: ["OK"],
    });
    await alert.present();
  }
}