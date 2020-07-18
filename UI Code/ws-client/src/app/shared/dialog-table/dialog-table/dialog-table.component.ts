import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-dialog-table',
  templateUrl: './dialog-table.component.html',
  styleUrls: ['./dialog-table.component.css']
})
export class DialogTableComponent implements OnInit {
  // displayedColumns = ['fileName', 'filePath', 'modifiedDate'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns = ['fileName', 'age', 'filePath', 'modifiedDate'];
  dataSource = new MatTableDataSource();
  fileDetails: any;
  treeNode: any;
  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
    // tslint:disable-next-line:align
    private dialogRef: MatDialogRef<DialogTableComponent>) {
    this.dataSource.paginator = this.paginator;

    if (data) {
      this.fileDetails = data.message;
      this.treeNode = data.treeNode;
      console.log('file :::: ', this.fileDetails);
    }
  }

  ngOnInit() {
  }
  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
