import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-bid-dialog',
  templateUrl: './bid-dialog.component.html',
  styleUrls: ['./bid-dialog.component.scss']
})
export class BidDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<BidDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
  }

}
