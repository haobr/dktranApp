import { Component, OnInit } from '@angular/core';
import { QUESTIONS } from '../shared/mock-questions';
import { Question } from '../shared/question';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor() { }

  check = true;
  list: Question[] = [];
  currentList: Question[] = [];
  fromIndex = 0;
  toIndex = 10;
  isLastPage = false;
  lastList: Question;
  email: '';

  ngOnInit() {
    this.check = true;
    this.list = QUESTIONS;
    this.currentList = _.filter(this.list, (item) => {
      return item.id > this.fromIndex && item.id <= this.toIndex;
    });
    this.lastList = _.last(this.list);
  }

  fncContinute() {
    this.fromIndex += 10;
    this.toIndex += 10;
    
    // let checkAnswer = _.filter(this.currentList, (item) => {
    //   return !item.lCheck && !item.mCheck;
    // });
    // if (checkAnswer.length > 0) {
    //   Swal.fire('Thông báo', 'Vul lòng trả lời hết các câu hỏi!', 'error');
    // } else {
    //   this.currentList = _.filter(this.list, (item) => {
    //     return item.id > this.fromIndex && item.id <= this.toIndex;
    //   });
    // }

    this.currentList = _.filter(this.list, (item) => {
      return item.id > this.fromIndex && item.id <= this.toIndex;
    });

    let lastCurrentQuest = _.last(this.currentList);
    if (lastCurrentQuest == this.lastList) this.isLastPage = true;
    else this.isLastPage = false;

    
  }

  fncPrevious() {
    if (this.fromIndex > 0) {
      this.fromIndex = this.fromIndex - 10;
      this.toIndex = this.toIndex - 10;
    } else {
      this.fromIndex = 0;
      this.toIndex = 10;
    }
    this.currentList = _.filter(this.list, (item) => {
      return item.id > this.fromIndex && item.id <= this.toIndex;
    });
  }

  fncCheckAnswer(item: Question, type: number) {
    if (type == 0) item.lCheck = !item.mCheck;
    else if (type == 1) item.mCheck = !item.lCheck;
  }

  fncShowModal() {
    // let checkAnswer = _.filter(this.currentList, (item) => {
    //   return !item.lCheck && !item.mCheck;
    // });
    // if (checkAnswer.length > 0) {
    //   Swal.fire('Thông báo', 'Vul lòng trả lời hết các câu hỏi!', 'error');
    // } else {
    //   if (this.isLastPage) {
    //     $("#exampleModal").modal();
    //   }
    // }
    $("#exampleModal").modal();
  }

  sendEmail() {
    console.log(this.email);
  }
}
