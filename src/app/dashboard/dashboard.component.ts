import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  message: string = '';
  tweets: any[] = [];

  constructor(private http: HttpClient) { }

  generateTweets() {
    this.http.post<any[]>('http://localhost:3000/generate-tweets', { message: this.message })
      .subscribe(
        (response) => {
          this.tweets = response;
        },
        (error) => {
          console.error('Error generating tweets:', error);
        }
      );
  }
}
