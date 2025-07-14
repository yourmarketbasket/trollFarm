import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule],
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
