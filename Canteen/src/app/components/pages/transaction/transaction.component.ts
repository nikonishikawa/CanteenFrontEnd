import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Transaction } from '../../../models/transaction.model';
import { TransactionService } from '../../../services/transaction.service';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../models/user.model';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent implements OnInit{
  transac: Transaction = new Transaction(); 
  transaction: Transaction[] = [];
  customer: Customer = new Customer();
  customerId!: number;

  constructor(private route: ActivatedRoute, private router: Router, private transactionService: TransactionService, private customerService: CustomerService) { }

  ngOnInit() {
    this.loadCustomerData();
  }

  statusTag() {

  }

  loadCustomerData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.customerService.loadCustomerData().subscribe({
        next: (res) => {
          console.log('Received customer data:', res.data.customerId);
          this.customerId = res.data.customerId;
          resolve();
        },
        error: (error) => {
          console.error('Error loading customer data:', error);
          reject(error);
        }
      });
    });
  }
  getAllTransaction() {
    this.transactionService.getAllTransaction(this.customerId).subscribe(
      (response: any) => {
        if (response.isSuccess) {
          this.transac = response.data;
          console.log("Response", response);
  
          if (this.transaction && this.transaction.length > 0) {
            this.transaction.forEach(transacItem => {
              if (transacItem && transacItem) {
                console.log("Order ID:", transacItem.orderId);
                console.log("Order Stamp:", transacItem.orderStamp);
                console.log("Cost:", transacItem.cost);
                console.log("Status:", transacItem.status);
              } else {
                console.error("Transaction is undefined:", transacItem);
              }
            });
          } else {
            console.error("Transaction array is empty or undefined");
          }
        } else {
          console.error('Error retrieving transaction history:', response.message);
        }
      },
      (error) => {
      }
    );
  }

  @Output() searchQuery = new EventEmitter<string>();

  onSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const query = inputElement.value;
    this.searchQuery.emit(query);
}

}
