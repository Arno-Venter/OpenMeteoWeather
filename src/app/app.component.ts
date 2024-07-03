import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ForecastComponent } from "./components/forecast/forecast.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ForecastComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {
  title = "open-meteo";
}
