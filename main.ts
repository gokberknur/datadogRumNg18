import { bootstrapApplication } from '@angular/platform-browser';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, Component, inject, OnInit } from '@angular/core';
import { datadogRum } from '@datadog/browser-rum';

// with fetch
export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(withFetch())],
};

// without Fetch
// export const appConfig: ApplicationConfig = {
//   providers: [provideHttpClient()],
// };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonPipe, AsyncPipe],
  template: `
    <h1>hello rum with fetch</h1>
    <p>{{ response$ | async | json }}</p>
  `,
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  response$ = this.getResponse();

  ngOnInit(): void {
    this.datadog();
  }

  getResponse() {
    const url = 'https://www.gov.uk/bank-holidays.json';
    return this.http.get<any>(url);
  }

  datadog() {
    datadogRum.init({
      applicationId: 'appID',
      clientToken: 'YourclientToken',
      site: 'datadoghq.eu',
      service: 'service',
      env: 'env',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 100,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
    });
  }
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
