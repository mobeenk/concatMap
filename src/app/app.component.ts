import { Component } from '@angular/core';
import { ApiService } from './services/apiservice.service';
import { OrderService } from './services/orders.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'parallel-api-calls';
  orderedPages: any[][] = [];
  constructor(private apiService: ApiService,private orderService: OrderService) {}
  ngOnInit(): void {

  }

  fetchPagesOneByOne() {
    const pageSize = 10; // Adjust the page size as needed
    this.orderService.getOrdersSequentially(pageSize).subscribe(
      (result) => {
        this.orderedPages = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  fetchPagesSameTime() {
    const pageSize = 10; // Adjust the page size as needed
    this.orderService.getOrdersSequentiallySameTime(pageSize).subscribe(
      (result) => {
        this.orderedPages = result;
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
