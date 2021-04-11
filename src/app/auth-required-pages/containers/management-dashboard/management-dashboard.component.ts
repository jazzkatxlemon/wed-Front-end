/* tslint:disable:no-shadowed-variable */
import {Component, OnInit} from '@angular/core';
import {ChartOptions, ChartType} from 'chart.js';
import {Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip, SingleDataSet} from 'ng2-charts';
import {mockNoCommentYet} from '../../interfaces/exReport';
import {CommonService} from '../../services/common.service';
import {assignment} from '../../interfaces/assignment';


@Component({
  selector: 'app-management-dashboard',
  templateUrl: './management-dashboard.component.html',
  styleUrls: ['./management-dashboard.component.scss']
})
export class ManagementDashboardComponent implements OnInit {
  private facultyName: any;
  private assignmentList: any;
  public submissionList: any;
  private assignment: assignment;
  public overDueSub = [];
  public notCommentedYet = [];
  private SubCount: any;


  constructor(private commonService: CommonService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  public p = 1;
  private facultyList = [];
  private currentYear = new Date().getFullYear();

  public pieChartOptions: ChartOptions = {
    title: {
      text: `Total Contributions - ${this.currentYear}`,
      display: true
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];


  getFacultyChart(): any {
    if (this.facultyList) {
      this.pieChartLabels = this.facultyList.map(faculty => {
        return ['Department of', `${faculty.facultyName}`];
      });
      console.log(this.pieChartLabels);
      console.log(this.facultyList);
      this.facultyList.forEach(f => {
        this.commonService.getSubmissionCount({
          facultyId: f.facultyId,
        }).subscribe(response => {
          if (response.success && response.data) {
            this.pieChartData.push(response.data.length);
          }
        });
      });
      console.log(this.pieChartData);
    }
  }

  ngOnInit(): void {
    this.commonService.searchAssignment({
      facultyId: null,
      username: '',
      deadlineId: null
    }).subscribe(a => {
      this.assignmentList = a.data;
      console.log(this.assignmentList);

      this.commonService.getFaculties().subscribe(f => {
        this.facultyList = f.data;
        this.getFacultyChart();
        console.log(this.facultyList);

        this.commonService.searchSubmission({
          username: '',
          assignmentId: null,
          status: null
        }).subscribe(s => {
          this.submissionList = s.data;
          console.log(this.submissionList);

          this.submissionList.forEach(s => {
            this.assignmentList.forEach(a => {
              if (s.assignmentId === a.assignment.assignmentId) {
                s.facultyId = a.assignment.facultyId;
                s.assignmentName = a.assignment.assignmentName;
                s.deadline = a.assignment.deadline;
                this.facultyList.forEach(f => {
                  if (f.facultyId === s.facultyId) {
                    s.facultyName = f.facultyName;
                  }
                });
              }
            });
          });
          console.log(this.submissionList);

          this.submissionList.forEach(s => {

            const a = new Date(s.deadline.endDate);
            const b = new Date();
            const c = new Date(s.deadline.startDate);
            if (a.getTime() < b.getTime() && c.getFullYear() === b.getFullYear()) {
              s.daysOverdue = Math.floor((b.getTime() - a.getTime()) / (1000 * 3600 * 24));
              this.overDueSub.push(s);
            } else if (a.getTime() > b.getTime() && c.getFullYear() === b.getFullYear()) {
              const d = new Date(s.submissionDate);
              s.daysSinceSubs = Math.floor((b.getTime() - d.getTime()) / (1000 * 3600 * 24));
              this.notCommentedYet.push(s);
            }
          });

          console.log(this.overDueSub);
          console.log(this.notCommentedYet);
        });
      });
    });


  }
}
