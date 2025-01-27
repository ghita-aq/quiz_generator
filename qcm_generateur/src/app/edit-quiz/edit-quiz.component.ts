import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuizsService } from '../services/quizs.service';
import { Quiz } from '../models/quiz.model';
import { Question } from '../models/question.model';

import { CommonModule } from '@angular/common'; // Use CommonModule instead of NgFor
import { ReactiveFormsModule} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'edit-quiz',
  templateUrl: './edit-quiz.component.html',
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule // Add ReactiveFormsModule
  ],
  styleUrls: ['./edit-quiz.component.scss']
})
export class EditQuizComponent implements OnInit {
  generatedQuiz!: Quiz;
  questions: Question[] = []; 
  editquizForm!: FormGroup;
  questionForm!: FormGroup;
  
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private quizsService: QuizsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.quizsService.getQuizById(id).subscribe({
          next: (generatedQuiz: Quiz | undefined) => {
            if (generatedQuiz) {
              this.generatedQuiz = generatedQuiz;
              this.questions=generatedQuiz.questions;
              console.log(generatedQuiz);
            } else {
              console.error('Quiz not found');
            }
          },
          error: (err: any) => {
            console.error('Error fetching quiz:', err);
          }
        });
      }
    });
    this.initializeForms();
    console.log(this.questions);

  }
  counter(i: number) {
      return new Array(i);
  }
    initializeForms() {
      this.editquizForm = this.fb.group({
        name: [this.generatedQuiz.name, Validators.required],
        description: [this.generatedQuiz.description]
      });
  
      this.questionForm = this.fb.group({
        description: ['', Validators.required],
        options: this.fb.array([
          this.createChoiceControl(),
          this.createChoiceControl(),
          this.createChoiceControl(),
          this.createChoiceControl()
        ]),
        correctAnswer: ['', Validators.required]
      });
    }
  
    trackByIndex(index: number, item: any): number {
      return index;
    }
    createChoiceControl() {
      return this.fb.control('', Validators.required);
    }
   get choicesControls() {
      return (this.questionForm.get('options') as FormArray).controls;
    }
  
    // Add a new question to the list
    addQuestion() {
      console.log(this.questionForm.value);
      const question = new Question(
        this.questions.length + 1, 
        this.questionForm.value.description,
        this.choicesControls.map(control => control.value),
        this.questionForm.value.correctAnswer,
      );
      this.questions.push(question);
      console.log(this.questions);
      this.questionForm.reset({
        description: "",
        options: this.fb.array([
          this.createChoiceControl(),
          this.createChoiceControl(),
          this.createChoiceControl(),
          this.createChoiceControl(),
        ]),
        correctAnswer: ""
      });
    }
    
    showQuestion(id: number) {
      const question = this.questions.find(q => q.id === id);
      if (question) {
        this.questionForm.patchValue({
          description: question.description,
          correctAnswer: question.correctAnswer
        });
    
        const optionsArray = question.options.map(option => this.fb.control(option, Validators.required));
        this.questionForm.setControl('options', this.fb.array(optionsArray));
      }
    }
    editQuestion(id: number) {
      const question = this.questions.find(q => q.id === id);
      if (question) {
        this.questionForm.patchValue({
          description: question.description,
          options: question.options.map(option => this.fb.control(option, Validators.required)),
          correctAnswer: question.correctAnswer
        });
  
        // Remove the question from the list to avoid duplication
        this.questions = this.questions.filter(q => q.id !== id);
      }
    }
    deleteQuestion(id: number) {
      this.questions = this.questions.filter(question => question.id !== id);
      this.questions.forEach((question, index) => {
        question.id = index + 1;
      });
    }
  
    EditQuiz() {
      const editedQuiz = new Quiz(
        this.editquizForm.value.name,
        this.editquizForm.value.description,
        this.questions,
      );
      console.log(this.generatedQuiz);
      this.quizsService.editQuiz(editedQuiz).subscribe({
        next: (quiz) => {
          console.log('Quiz generated:', quiz);
          this.router.navigate(['/']); // Redirect to the home page
        },
        error: (err) => {
          console.error('Error generating quiz:', err);
        }
      });
    }

}
