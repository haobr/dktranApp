import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Question } from '../shared/question';

@Injectable({providedIn: 'root'})
export class MailService {
    constructor(private _http: HttpClient) { }

    url = 'https://dev-tc-chatbot.aa.akaminds.co.jp/api/submit_disc_result/';
    
    postData(bodyJson: any) {
        return this._http.post(this.url, bodyJson);
    }
}