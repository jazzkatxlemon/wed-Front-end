import { Injectable } from '@angular/core';
import { assignmentStatus } from '../interfaces/assignment';


@Injectable({
  providedIn: 'root'
})
export class AssignmentDetailsService {

  constructor() { }
  assignment = [];
  setAssignment(asm) {
    this.assignment = asm;
    console.log(asm)
  }
  getAssignment() {
    return this.assignment
  }
  /**
   * Change Assignment Status code to Message.
   * @param status : assignmentStatus code
   * @returns 
   */
  statusDecoder(status: assignmentStatus) {
    let msg: string;
    switch (status) {
      case (status = assignmentStatus.accepted):
        msg = 'Accepted';
        return msg;
      case (status = assignmentStatus.rejected):
        msg = 'Rejected';
        return msg;
      case (status = assignmentStatus.commentNotEval):
        msg = 'Feedback Available';
        return msg;
      case (status = assignmentStatus.noAction):
        msg = 'Pending';
        return msg;
    }
  }
  addDate(date: Date, days: number) {
    let newDate = new Date(date);
    let finalDate = newDate.setDate(newDate.getDate() + days);
    return finalDate;
  }
}
