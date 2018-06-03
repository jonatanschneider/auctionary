import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auction } from '../../../models/Auction';
import { NotificationService } from '../../../services/util/notification.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    startingPrice: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9]+(,\\d{1,2})?$')
    ]),
    description: new FormControl(''),
    color: new FormControl('')
  });

  constructor(public dialogRef: MatDialogRef<EditDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private notificationService: NotificationService) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save():void {
    if (this.form.invalid) {
      this.notificationService.show('Please check your input.');
      return;
    }
    this.dialogRef.close({
      name: this.form.get('name').value,
      startingPrice: this.form.get('startingPrice').value,
      description: this.form.get('description').value,
      color: this.form.get('color').value,
      endTime: this.data.auction.endTime,
      sellerId: this.data.auction.sellerId,
      id: this.data.auction.id
    } as Auction);
  }

  ngOnInit(): void {
    this.form.patchValue({
      name: this.data.auction.name,
      description: this.data.auction.description,
      color: this.data.auction.color,
      startingPrice: this.data.auction.startingPrice
    });
  }
}
