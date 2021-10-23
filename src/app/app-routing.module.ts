import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomePageModule } from "./home/home.module";
import { HomePage } from "./home/home.page";
import { WelcomePageModule } from "./welcome/welcome.module";
import { WelcomePage } from "./welcome/welcome.page";

const routes: Routes = [
  // { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "", redirectTo: "welcome", pathMatch: "full" },
  { path: "home", loadChildren: "./home/home.module#HomePageModule" },
  // { path: "/home", redirectTo: "home", pathMatch: "full" },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule' },
  { path: 'signup', loadChildren: './signup/signup.module#SignupPageModule' },
  {
    path: "admin-panel",
    loadChildren: "./admin-panel/admin-panel.module#AdminPanelPageModule",
  },
  {
    path: "feedback",
    loadChildren: "./feedback/feedback.module#FeedbackPageModule",
  },
  {
    path: "cover-page",
    loadChildren: "./cover-page/cover-page.module#CoverPagePageModule",
  },
  // {
  //   path: "/welcome",
  //   redirectTo: "welcome",
  //   pathMatch: "full"
  // },
  { path: "welcome", loadChildren: "./welcome/welcome.module#WelcomePageModule" },
  { path: 'prompt', loadChildren: './prompt/prompt.module#PromptPageModule' },
  { path: 'themes', loadChildren: './themes/themes.module#ThemesPageModule' },


  // { path: 'open-project', loadChildren: './open-project/open-project.module#OpenProjectPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
