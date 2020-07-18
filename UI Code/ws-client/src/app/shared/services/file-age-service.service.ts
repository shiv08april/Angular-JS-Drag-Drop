import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppLocalConfig } from '../../config/app.local.config';
@Injectable({
  providedIn: 'root'
})
export class FileAgeServiceService {
  constructor(private readonly http: HttpClient, private readonly appConfig: AppLocalConfig) { }

  fileServices = this.appConfig.getConfig()['file-services'];

  fetchFileDetailsByDuration(fileAge) {
    const url = `${this.fileServices.fetchFileDetailsByDuration}?minutes=${fileAge}`;
    console.log('url ', url);
    return this.http.get(url);
  }
}
