import { Injectable } from "@angular/core";
@Injectable()
export class AppLocalConfig {

    getConfig() {
        return {
            'file-services': {
                fetchFileDetailsByDuration: 'api/files/fileDetails',
            }
        };
    }
}
