import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Quiz } from "../models/quiz.model";
import { Question } from "../models/question.model";

@Injectable({
  providedIn: 'root'
})
export class QuizsService {
  private readonly dataFilePath = 'assets/data.json';
  private readonly storageKey = 'quizs';

  constructor(private http: HttpClient) {}

  private readData(): Observable<{ quizs: Quiz[] }> {
    const localData = localStorage.getItem(this.storageKey);
    if (localData) {
      return of(JSON.parse(localData));
    } else {
      return this.http.get<{ quizs: Quiz[] }>(this.dataFilePath).pipe(
        tap(data => localStorage.setItem(this.storageKey, JSON.stringify(data)))
      );
    }
  }

  private writeData(data: { quizs: Quiz[] }): void {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  getQuizs(): Observable<Quiz[]> {
    return this.readData().pipe(map(data => data.quizs));
  }

  generateQuiz(name: string, description: string, questions: Question[]): Observable<Quiz> {
    return this.readData().pipe(map(data => {
      const newQuiz: Quiz = {
        id: crypto.randomUUID().substring(0, 8),
        name: `${name.toUpperCase()} Quiz`,
        description: description,
        questions: questions,
        totalQuestions: questions.length,
      };
      data.quizs.push(newQuiz);
      this.writeData(data);
      return newQuiz;
    }));
  }

  getQuizById(id: string): Observable<Quiz | undefined> {
    return this.readData().pipe(map(data => {
      const foundQuiz = data.quizs.find(quiz => quiz.id === id);
      if (!foundQuiz) {
        throw new Error('Quiz not found');
      }
      return foundQuiz;
    }));
  }

  editQuiz(quiz: Quiz): Observable<void> {
    return this.readData().pipe(
      map(data => {
        const index = data.quizs.findIndex(q => q.id === quiz.id);
        data.quizs[index] = quiz;
        this.writeData(data);
      }),
      switchMap(() => of(void 0))
    );
  }

  deleteQuizById(id: string): Observable<void> {
    return this.readData().pipe(
      map(data => {
        data.quizs = data.quizs.filter(quiz => quiz.id !== id);
        this.writeData(data);
      }),
      switchMap(() => of(void 0))
    );
  }
}