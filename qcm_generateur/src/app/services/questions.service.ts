// import { Injectable } from "@angular/core";
// import { Question } from "../models/question.model";

// @Injectable({
//   providedIn: 'root'
// })

// export class QuestionsService {
//    private readonly questions : Question[] = [] ;
//     generateQuestion(id: number, description: string, options: string[], correctAnswer: string, quizId: number): Question {
//          const newQuestion: Question = {
//               id: id,
//               description: description,
//               options: options,
//               correctAnswer: correctAnswer,
//               quizId: quizId,
//          };
//          this.questions.push(newQuestion);
//          return newQuestion;
//     }
//     addQuestion(question: Question): void {
//             this.questions.push(question);
//       }
//       editQuestion(question: Question): void {    
//             const index = this.questions.findIndex(q => q.id === question.id);
//             this.questions[index] = question;     
//       }
//           deleteQuestionById(id: number): void {
//                const index = this.questions.findIndex(question => question.id === id);
//                this.questions.splice(index, 1);
//           }
//           getQuestionsByQuizId(quizId: number): Question[] {
//                return this.questions.filter(question => question.quizId === quizId);
//           }
//           deleteQuestionsByQuizId(quizId: number): void {   
//                this.questions.filter(question => question.quizId !== quizId);
//           }

               
// }

import { Injectable } from "@angular/core";
import { Question } from "../models/question.model";
import * as fs from 'fs';
import * as path from 'path';
import { Quiz } from "../models/quiz.model";

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private readonly dataFilePath = path.join(__dirname, 'data.json');

  private readData(): { quizs: Quiz[] } {
    const data = fs.readFileSync(this.dataFilePath, 'utf8');
    return JSON.parse(data);
  }

  private writeData(data: { quizs: Quiz[] }): void {
    fs.writeFileSync(this.dataFilePath, JSON.stringify(data, null, 2), 'utf8');
  }

  getQuestions(quizId: string): Question[] {
    const data = this.readData();
    const quiz = data.quizs.find(q => q.id === quizId);
    return quiz ? quiz.questions : [];
  }

  addQuestion(quizId: string, question: Question): void {
    const data = this.readData();
    const quiz = data.quizs.find(q => q.id === quizId);
    if (quiz) {
      quiz.questions.push(question);
      quiz.totalQuestions = quiz.questions.length;
      this.writeData(data);
    }
  }

  deleteQuestionById(quizId: string, questionId: number): void {
    const data = this.readData();
    const quiz = data.quizs.find(q => q.id === quizId);
    if (quiz) {
      quiz.questions = quiz.questions.filter(question => question.id !== questionId);
      quiz.totalQuestions = quiz.questions.length;
      this.writeData(data);
    }
  }
}