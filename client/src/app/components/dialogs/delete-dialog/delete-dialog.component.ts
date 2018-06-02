import { Component } from '@angular/core';
import { BidDialogComponent } from '../bid-dialog/bid-dialog.component';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent {

  constructor(public dialogRef: MatDialogRef<BidDialogComponent>) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
