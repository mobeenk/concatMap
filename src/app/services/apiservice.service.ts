import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'https://localhost:7168/northwind/';

  constructor(private http: HttpClient) {}

  getTask1(): Observable<any> {
    const url = `${this.apiUrl}GetTask1`;
    return this.http.get(url);
  }

  getTask2(): Observable<any> {
    const url = `${this.apiUrl}GetTask2`;
    return this.http.get(url);
  }

  getTasksSequentially(): Observable<any[]> {
    return this.getTask1().pipe(concatMap(() => this.getTask2()));
  }
}
