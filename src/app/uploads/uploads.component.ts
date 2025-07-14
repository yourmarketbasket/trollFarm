import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SocketService } from '../socket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-uploads',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './uploads.component.html',
  styleUrls: ['./uploads.component.scss']
})
export class UploadsComponent {
  selectedFile: File | null = null;
  data: any;

  constructor(private http: HttpClient, private socketService: SocketService) { }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.http.post<any>('http://localhost:3000/upload', formData).subscribe(
        (response) => {
          this.data = response;
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    }
  }
}
