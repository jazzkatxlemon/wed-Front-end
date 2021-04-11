import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-assignment',
  templateUrl: './new-assignment.component.html',
  styleUrls: ['./new-assignment.component.scss']
})
export class NewAssignmentComponent implements OnInit {
  deadlineList = [];

  constructor(private commonService: CommonService, private toastrService: ToastrService) { }
user
  ngOnInit(): void {
    this.commonService.getMyInfo({}).subscribe(val => {
      if (val) {
        this.user = val.data;
      }
    });
  }

  filterStart = new FormControl('');
  filterEnd = new FormControl('');
  assignmentName = new FormControl('');
  description = new FormControl('');
  // deadlineSelect = new FormControl('');
  
  // onDeadlineSet(event: any) {
  //   let deadlineId = event.target.value;
  //   console.log(deadlineId)
  //   console.log(this.deadlineSelected)
  //   return deadlineId;
  // }

  deadlineSelected;
  onSearch() {
    console.log(this.filterEnd.value)
    this.commonService.getDeadlinePeriod({
      date: {
        from: this.filterStart.value,
        to: this.filterEnd.value
      }
    }).subscribe(value => {
      this.deadlineList = value.data;
      console.log(value)
    })
  }

  newAssignment() {
    this.commonService.createAssignment({
      assignName: this.assignmentName.value,
      description: this.description.value,
      facultyId: this.user.facultyId,
      // deadlineId: parseInt(`${(<HTMLOptionElement>document.querySelector(`#deadline-select`)).value}`)
      deadlineId: this.deadlineSelected
      //TODO: this currently doesn't return a value.
    }).subscribe(value => {
      if (value.success) {
        this.toastrService.success(`Assignment "${this.assignmentName.value}" added!`);
        console.log('added!')
      }
      else {
        const message = `Failed to create "${this.assignmentName.value}". Error code:` + value.responseMessage.message + ' ' + value.responseMessage.errorCode
        this.toastrService.error(message)
        console.log(message)
      }
    })
  }
  
  logDescription() {
    console.log(this.description.value)
  }
}