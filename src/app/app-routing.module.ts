import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomePageModule } from "./home/home.module";
import { HomePage } from "./home/home.page";
import { WelcomePageModule } from "./welcome/welcome.module";
import { WelcomePage } from "./welcome/welcome.page";

const routes: Routes = [
  // { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "", redirectTo: "welcome", pathMatch: "full" },
  { path: "home", loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  // { path: "/home", redirectTo: "home", pathMatch: "full" },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'signup', loadChildren: () => import('./signup/signup.module').then(m => m.SignupPageModule) },
  {
    path: "admin-panel",
    loadChildren: () => import('./admin-panel/admin-panel.module').then(m => m.AdminPanelPageModule),
  },
  {
    path: "feedback",
    loadChildren: () => import('./feedback/feedback.module').then(m => m.FeedbackPageModule),
  },
  {
    path: "cover-page",
    loadChildren: () => import('./cover-page/cover-page.module').then(m => m.CoverPagePageModule),
  },
  // {
  //   path: "/welcome",
  //   redirectTo: "welcome",
  //   pathMatch: "full"
  // },
  { path: "welcome", loadChildren: () => import('./welcome/welcome.module').then(m => m.WelcomePageModule) },
  { path: 'prompt', loadChildren: () => import('./prompt/prompt.module').then(m => m.PromptPageModule) },
  { path: 'themes', loadChildren: () => import('./themes/themes.module').then(m => m.ThemesPageModule) },


  // { path: 'open-project', loadChildren: './open-project/open-project.module#OpenProjectPageModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
