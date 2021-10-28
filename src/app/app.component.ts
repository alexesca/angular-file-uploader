import {Component, Input} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {Subscription} from 'rxjs';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @Input()
  requiredFileType: string;

  fileName = '';
  uploadProgress: number;
  uploadSub: Subscription;

  constructor(private http: HttpClient) {}

  onFileSelected(event): any {
    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('thumbnail', file);

      const upload$ = this.http.post('/api', formData, {
        reportProgress: true,
        observe: 'events'
      })
        .pipe(
          finalize(() => this.reset())
        );

      this.uploadSub = upload$.subscribe((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(100 * (event.loaded / event.total));
        }
      });
    }
  }

  cancelUpload(): void {
    this.uploadSub.unsubscribe();
    this.reset();
  }

  reset(): void {
    this.uploadProgress = null;
    this.uploadSub = null;
  }
}
