import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../Service/question.service';
import { interval } from 'rxjs';
@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public name: string = "";
  public questionList: any = [];
  public currentQuestions: number = 0;
  public points: number = 0;
  counter = 60;
  correctanswer: number = 0;
  incorrectAnswer: number = 0;
  interval$: any;
  progress: string = "0";
  isQuizCompleted : boolean = false;
  constructor(private srvc: QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.getAllQuestions();
    this.startCounter();
  }
  getAllQuestions() {
    this.srvc.getQuestionJson().subscribe(res => {
      this.questionList = res.questions;
      console.log(res.questions);
    })
  }
  nextQuestion() {
    this.currentQuestions++;
  }
  prevQuestion() {
    this.currentQuestions--;
  }
  answers(currentQuestions: number, option: any) {
    if(currentQuestions === this.questionList.length){
      this.isQuizCompleted =true;
      this.stopCounter();
    }
    if (option.correct) {
      this.points += 10;
      this.correctanswer++;
      setTimeout(() => {
        this.currentQuestions++;
        // this.points = this.points +10;
        this.resetCounter();
        this.getProgressPercent();
      }, 1000);
    } else {
      setTimeout(() => {
        this.currentQuestions++;
        this.incorrectAnswer++;
        this.resetCounter();
        this.getProgressPercent();
      },1000)
      this.points -= 10;
    }
  }
  startCounter() {
    this.interval$ = interval(1000).subscribe(val => {
      this.counter--;
      if (this.counter === 0) {
        this.currentQuestions++;
        this.counter = 60;
        this.points -= 10;
      }
    });
    setTimeout(() => {
      this.interval$.unsubscribe();
    }, 600000);
  }
  stopCounter() {
    this.interval$.unsubscribe();
    this.counter = 0;
  }
  resetCounter() {
    this.stopCounter();
    this.counter = 60;
    this.startCounter();
    this.progress = "0";
  }
  resetQuiz() {
    this.resetCounter();
    this.getAllQuestions();
    this.points = 0;
    this.counter = 60;
    this.currentQuestions = 0;
  }
  getProgressPercent() {
    this.progress = ((this.currentQuestions / this.questionList.length) * 100).toString();
    return this.progress;
  }

}
