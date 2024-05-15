import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PositionDto } from '../../../../models/manage-catalog.model';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ManagePositionService } from '../../../../services/manage-position.service';

@Component({
  selector: 'app-manage-position',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-position.component.html',
  styleUrl: './manage-position.component.css'
})
export class ManagePositionComponent implements OnInit {
  position: PositionDto[] = [];
  onPosition: PositionDto = {} as PositionDto;
  addPositionModal: boolean = false;
  editPositionModal: boolean = false;

  constructor(
    private managePositionService: ManagePositionService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadPosition();
  }

  openModal(): void {
    this.addPositionModal = true;
    this.editPositionModal = true;
  }

  closeModal(): void {
    this.addPositionModal = false;
    this.editPositionModal = false;
  }

  loadPosition(): void {
    this.managePositionService.getAllPosition().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.position = res.data;
          console.log('load position', this.position);
        }
      },
      error: (error) => {
        console.error('Error fetching Position:', error);
      }
    });
  }

  onPositionRegistration(): void {
    this.managePositionService.addPosition(this.onPosition).subscribe({
      next: (res) => {
        if (res && res.isSuccess) {
          this.toastr.success('Position Registration Successful');
          this.addPositionModal = false;
          this.loadPosition();
        } else {
          alert(res && res.message ? res.message : 'Position Registration failed');
        }
      },
      error: (error) => {
        console.error('Position Registration failed:', error);
        this.toastr.error('An error occurred during Position Registration');
      }
    });
  }

  openEditPositionModal(position: PositionDto): void {
    this.onPosition = { ...position };
    this.editPositionModal = true; 
  }

  savePosition() {
    const updatePosition: PositionDto = {
      positionId: this.onPosition.positionId,
      position: this.onPosition.position
    };

    this.managePositionService.editPosition(updatePosition).subscribe(
      (res) => {
        if (res && res.isSuccess) {
          this.toastr.success('Data updated successfully');
          this.editPositionModal = false;
          this.loadPosition();
        } else {
          alert(res && res.message ? res.message : 'Update failed');
        }
      },
      (error) => {
        console.error('Update failed:', error);
        this.toastr.error('An error occurred during the update');
      }
    );
  }

  deletePosition(positionId: number): void {
    this.managePositionService.deletePosition(positionId).subscribe({
      next: (res) => {
        if (res && res.isSuccess) {
          this.toastr.warning('Position Deletion Successful');
          this.loadPosition();
        } else {
          alert(res && res.message ? res.message : 'Position Deletion failed');
        }
      },
      error: (error) => {
        console.error('Position Deletion failed:', error);
        this.toastr.error('An error occurred during Position Deletion');
      }
    });
  }
}
