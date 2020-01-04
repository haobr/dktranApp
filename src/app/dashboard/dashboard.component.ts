import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { QUESTIONS } from '../shared/mock-questions';
import { Question } from '../shared/question';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { CountdownComponent } from 'ngx-countdown';
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  
  

  constructor() { }

  check = true;
  list: Question[] = [];
  currentList: Question[] = [];
  fromIndex = 0;
  toIndex = 4;
  isLastPage = false;
  lastList: Question;
  email: '';
  isSubmit = false;
  progressPercent = 0;
  totalQuestion = 0;
  
  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  config = {
    leftTime: 600,
    notify: [ 1, 1 ] // Thông báo khi hết giờ
    // format: 'm:s'
  }

  ngOnInit() {
    this.check = true;
    this.list = QUESTIONS;
    this.currentList = _.filter(this.list, (item) => {
      return item.id > this.fromIndex && item.id <= this.toIndex;
    });
    this.lastList = _.last(this.list);
    
    this.totalQuestion = this.list.length;
  }

  ngAfterViewInit(): void {
    this.countdown.begin();
  }

  fncContinute() {
    this.fromIndex += 4;
    this.toIndex += 4;
  // Thông báo warning khi không trả lời hết các câu hỏi
    let checkAnswer = _.filter(this.currentList, (item) => {
      return !item.lCheck && !item.mCheck;
    });
    if (checkAnswer.length > 0) {
      Swal.fire('Thông báo', 'Vul lòng trả lời hết các câu hỏi!', 'error');
      this.fromIndex = this.fromIndex - 4;
      this.toIndex = this.toIndex - 4;
      return;
    } else {
      this.currentList = _.filter(this.list, (item) => {
        return item.id > this.fromIndex && item.id <= this.toIndex;
      });
    }

    this.currentList = _.filter(this.list, (item) => {
      return item.id > this.fromIndex && item.id <= this.toIndex;
    });

    let lastCurrentQuest = _.last(this.currentList);
    if (lastCurrentQuest == this.lastList) this.isLastPage = true;
    else this.isLastPage = false;
  }

  fncPrevious() {
    this.isLastPage = false;
    if (this.fromIndex > 0) {
      this.fromIndex = this.fromIndex - 4;
      this.toIndex = this.toIndex - 4;
    } else {
      this.fromIndex = 0;
      this.toIndex = 4;
    }
    this.currentList = _.filter(this.list, (item) => {
      return item.id > this.fromIndex && item.id <= this.toIndex;
    });
  }

  fncCheckAnswer(item: Question, type: number) {
    if (type == 0) item.lCheck = !item.mCheck;
    else if (type == 1) item.mCheck = !item.lCheck;
    // thay đổi thanh tiến độ làm
    let mList = _.filter(this.list, (item) =>{
      return item.lCheck != item.mCheck;
    });
    let quantity = mList.length;
    this.progressPercent = quantity;
  }

  fncShowModal() {
    let checkAnswer = _.filter(this.currentList, (item) => {
      return !item.lCheck && !item.mCheck;
    });
    if (checkAnswer.length > 0) {
      Swal.fire('Thông báo', 'Vul lòng trả lời hết các câu hỏi!', 'error');
      return;
    } else {
      if (this.isLastPage) {
        $("#exampleModal").modal();
      }
    }
    $("#exampleModal").modal();
    this.isSubmit = true;
    this.countdown.stop();
  }

  sendEmail() {
    console.log(this.email);
  }

  // Xử lý countdown
  handleEvent(event: any) {
    if (event.action == 'notify' && !this.isSubmit) {
      window.location.reload();
    }
  }
}
