import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionService } from '../service/question.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public name : string="";
  public questionList:any =[];
  public curruntQuestion:number = 0;
  public points:number=0;
  counter=60;
  correctAnswer:number=0;
  inCorrectAnswer:number=0;
  interval$:any;
  progress:string="0";
  // interval: any;
  constructor(private questionService : QuestionService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem("name")!;
    this.getAllQuestions();
    this.startCounter();
  }

  getAllQuestions(){
    this.questionService.getQuestionJson()
    .subscribe(res =>{
    this.questionList = res.questions;
    console.log(this.questionList);
    })
  }

  nextQuestion(){
    this.curruntQuestion++;

  }

  previousQuestion(){
    this.curruntQuestion--;

  }

  answer(curruntQno:number,option:any){
    if(option.correct){
      this.points+=10
      this.curruntQuestion++;
      // this.points=this.points+10;
      this.getProgressPercent();
      this.correctAnswer++;
     
    }else{
      this.points-=10;
      this.curruntQuestion++;
      this.inCorrectAnswer++;  
      this.getProgressPercent();
    }

  }

  startCounter(){
    this.interval$ = this.interval$(1000)
    .subscribe((val: any)=>{
      this.counter--;
      if(this.counter===0){
        this.curruntQuestion++;
        this.counter=60;
        this.points-=10;
      }
    });
    setTimeout(()=>{
      this.interval$.unsubscribe();

    },600000);

  }

  stopCounter(){
    this.interval$.unsubscribe();
    this.counter=0;

  }
  
  resetCounter(){

    this.stopCounter();
    this.counter=60;
    this.startCounter();
  }
  resetQuiz(){
    this.resetCounter();
    this.getAllQuestions();
    this.points=0;
    this.counter=60;
    this.curruntQuestion=0;
    this.progress="0";
  }

  getProgressPercent(){
    this.progress=((this.curruntQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }
}
