import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, concatMap, finalize, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'https://localhost:7168/northwind/';
  constructor(private http: HttpClient) {}

  getOrdersCount(): Observable<number> {
    const url = `${this.apiUrl}GetOrdersCount`;
    return this.http.get<number>(url);
  }

  getOrdersPage(pageNumber: number, pageSize: number): Observable<any[]> {
    const url = `${this.apiUrl}GetOrdersPaginated?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<any[]>(url);
  }

  
  getOrdersSequentiallySameTime(pageSize: number): Observable<any[]> {
    return this.getOrdersCount().pipe(
      mergeMap((totalCount) => {
        const pageRequests: Observable<any[]>[] = [];

        // Calculate the number of pages based on the total count and pageSize
        const pageCount = Math.ceil(totalCount / pageSize);

        // Initiate requests for each page sequentially
        for (let i = 1; i <= pageCount; i++) {
          pageRequests.push(this.getOrdersPage(i, pageSize));
        }

        // Combine requests using forkJoin to execute them in parallel
        return forkJoin(pageRequests);
      })
    );
  }
  getOrdersSequentially(pageSize: number): Observable<any[]> {
    return this.getOrdersCount().pipe(
      concatMap((totalCount) => {
        const pageCount = Math.ceil(totalCount / pageSize);
        const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);

        // Sequentially fetch pages one by one
        return this.fetchPagesSequentially(pageNumbers, pageSize);
      })
    );
  }
  private fetchPagesSequentially( pageNumbers: number[], pageSize: number): Observable<any[]> {
    if (pageNumbers.length === 0) {
      return of([]); // Return an empty array when all pages are fetched
    }

    const pageNumber = pageNumbers.shift()!; // Take the first page number

    return this.getOrdersPage(pageNumber, pageSize).pipe(
      concatMap((pageData) => {
        // Recursively fetch the next page
        return this.fetchPagesSequentially(pageNumbers, pageSize).pipe(
          // Combine the current page data with the previously fetched pages
          concatMap((previousPages) => of([...previousPages, pageData]))
        );
      }),
      catchError((error) => {
        console.error(`Error fetching page ${pageNumber}:`, error);
        return of([]); // Continue with an empty array on error
      }),
      finalize(() => {
        // Optional: Add any finalization logic here
      })
    );
  }

}
