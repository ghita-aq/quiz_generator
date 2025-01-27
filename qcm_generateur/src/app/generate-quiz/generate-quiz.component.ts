import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Use CommonModule instead of NgFor
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Question } from '../models/question.model';
import { QuizsService } from '../services/quizs.service';
// import { QuestionsService } from '../services/questions.service';
import { Quiz } from '../models/quiz.model';
import { SharedModule } from '../app.module';

@Component({
  selector: 'generate-quiz',
  standalone: true, 
  imports: [
    CommonModule, 
    RouterModule, 
    ReactiveFormsModule,
    // SharedModule
  ],
  templateUrl: './generate-quiz.component.html',
  styleUrl: './generate-quiz.component.scss'
})


export class GenerateQuizComponent implements OnInit {

  generatedQuiz!: Quiz;
  questions: Question[] = []; 
  quizForm!: FormGroup;
  questionForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder, 
    private quizService: QuizsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForms();
  }

  counter(i: number) {
    return new Array(i);
}
  initializeForms() {
    this.quizForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });

    this.questionForm = this.fb.group({
      description: ['', Validators.required],
      options: this.fb.array([
        this.createChoiceControl(),
        this.createChoiceControl(),
        this.createChoiceControl(),
        this.createChoiceControl()
      ]),
      correctAnswer: ["", Validators.required]
    });
  }

  createChoiceControl() {
    return this.fb.control('', Validators.required);
  }

  // Getter for choices form array
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

    console.log(this.questionForm);

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
        correctAnswer: question.correctAnswer // find cheked one
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

  generateQuiz() {
    this.generatedQuiz = new Quiz(
      this.quizForm.value.name,
      this.quizForm.value.description,
      this.questions
    );
    console.log(this.generatedQuiz);
    this.quizService.generateQuiz(this.quizForm.value.name, this.quizForm.value.description, this.questions).subscribe({
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
