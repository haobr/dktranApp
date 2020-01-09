import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { QUESTIONS } from '../shared/mock-questions';
import { Question } from '../shared/question';
import * as _ from 'lodash';
import Swal from 'sweetalert2';
import { CountdownComponent } from 'ngx-countdown';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AlertService } from '../_services/alert.service';
import { MailService } from '../_services/email.service';
import { timeout } from 'rxjs/operators';
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {


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
  form: FormGroup;
  submitted = false;

  @ViewChild('cd', { static: false }) private countdown: CountdownComponent;
  config = {
    leftTime: 600,
    notify: [1, 1] // Thông báo khi hết giờ
    // format: 'm:s'
  }

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private _service: MailService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])) 
    });

    this.check = true;
    this.list = QUESTIONS;
    this.currentList = _.filter(this.list, (item) => {
      return item.id > this.fromIndex && item.id <= this.toIndex;
    });
    this.lastList = _.last(this.list);

    this.totalQuestion = this.list.length / 2;
  }

  ngAfterViewInit(): void {
    this.countdown.begin();
  }

  fncContinute() {
    this.fromIndex += 4;
    this.toIndex += 4;
    // Thông báo warning khi không trả lời hết các câu hỏi
    let quantity = 0;
    _.forEach(this.currentList, (item) => {
      if (item.lCheck) quantity++;
      if (item.mCheck) quantity++;
    });

    if (quantity != 2) {
      Swal.fire('Thông báo', 'Vul lòng trả hai câu hỏi!', 'error');
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

    // chỉ được chọn tối đa 2 câu trả lời
    _.forEach(this.currentList, (elem) => {
      if (elem != item) {
        if (item.mCheck) {
          elem.mCheck = false;
        }
        if (item.lCheck) {
          elem.lCheck = false;
        }
      }
    });
    // thay đổi thanh tiến độ làm
    let mList = _.filter(this.list, (item) => {
      return item.lCheck != item.mCheck;
    });
    let quantity = mList.length;
    this.progressPercent = quantity;
  }

  fncShowModal() {
    // Thông báo warning khi không trả lời hết các câu hỏi
    let quantity = 0;
    _.forEach(this.currentList, (item) => {
      if (item.lCheck) quantity++;
      if (item.mCheck) quantity++;
    });
    if (quantity != 2) {
      Swal.fire('Thông báo', 'Vul lòng trả hai câu hỏi!', 'error');
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

  get f() { return this.form.controls; }

  sendEmail() {
    this.submitted = true;
    // reset alerts on submit
    this.alertService.clear();
    // stop here if form is invalid
    if (this.form.invalid) {
      return;
    }
    let name = this.f.name.value;
    let email = this.f.email.value;
    let answers = this.list.map((item) => {
      if (item.lCheck && !item.mCheck) return 'L';
      if (!item.lCheck && item.mCheck) return 'M';
      return '';
    });

    let data = {
      user_name: name,
      user_email: email,
      user_answer: answers,
      user_job: "111",
      total_answer_time: 10.4
    };

    this._service.postData(data).subscribe(
      (res) => {
        $("#exampleModal").modal('hide');

        Swal.fire({
          icon: 'success',
          title: 'Kết quả bài test của bạn đã được gửi qua email',
          html: 'Vui lòng kiểm tra để xác nhận. Mọi thông tin chi tiết xin vui lòng liên hệ hotline <strong>0972177047</strong>',
        }).then(res => {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        });
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Server xử lí kết quả lỗi. ',
          html: 'Vui lòng ấn nút "Gửi lại" để gửi lại kết quả qua email',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          cancelButtonText: 'Đóng',
          confirmButtonText: 'Gửi lại'
        }).then(result => {
          if (result.value) {
           this.reSendEmail(data);
          }
        })
      }
    )
  }

  reSendEmail(data:any) {
    this._service.postData(data).subscribe(
      (res) => {
        $("#exampleModal").modal('hide');
        Swal.fire({
          icon: 'success',
          title: 'Kết quả bài test của bạn đã được gửi qua email',
          html: 'Vui lòng kiểm tra để xác nhận. Mọi thông tin chi tiết xin vui lòng liên hệ hotline <strong>0972177047</strong>',
        }).then(res => {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        });
      }, (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Server đang bận!',
          text: 'Vui lòng quay lại sau'
        }).then(res => {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        });
      }
    )
  }

  // Xử lý countdown
  handleEvent(event: any) {
    if (event.action == 'notify' && !this.isSubmit) {
      window.location.reload();
    }
  }

  closeModal() {
    this.form.reset();
    $("#exampleModal").modal('hide');
  }
}
