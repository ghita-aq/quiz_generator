import { Component, OnInit } from '@angular/core';
import {RouterModule } from '@angular/router';
import { NgIf,NgFor } from '@angular/common';
import { Quiz } from '../models/quiz.model'; // Adjust the path as necessary
import { QuizsService } from '../services/quizs.service';
import { provideHttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'list-quizs',
  standalone: true,
  imports: [NgFor,RouterModule],
  
  templateUrl: './list-quizs.component.html',
  styleUrl: './list-quizs.component.scss'
})
export class ListQuizsComponent implements OnInit{
  quizs!: Quiz[];
  route: any;
  
  

  constructor(private readonly quizsService: QuizsService) { 
    
  }
  ngOnInit(): void {
    this.quizsService.getQuizs().subscribe({
      next: (data: Quiz[]) => {
        this.quizs = data;
        console.log(this.quizs);
      },
      error: (err) => {
        console.error('Error fetching quizzes:', err);
      }
    });
  }
 
  donwloadQuiz(id: string): void {
    this.quizsService.getQuizById(id).subscribe({
      next: (myquiz) => {
        console.log(myquiz);
        this.generatePDF(myquiz);
      },
      error: (err) => {
        console.error('Error fetching quiz:', err);
      }
    });

  }
  generatePDF(quiz: any): void {
    const doc = new jsPDF();
    let y = 10;
  
    doc.setFontSize(16);
    doc.text(quiz.name, 10, y);
    y += 10;
  
    doc.setFontSize(12);
    doc.text(quiz.description, 10, y);
    y += 10;
  
    quiz.questions.forEach((question: any, index: number) => {
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${question.description}`, 10, y);
      y += 10;
  
      question.options.forEach((option: string, optIndex: number) => {
        doc.setFontSize(12);
        doc.text(`${String.fromCharCode(65 + optIndex)}. ${option}`, 15, y);
        y += 10;
      });
  
      y += 10;
    });
  
    doc.save(`${quiz.name}.pdf`);
  }

  
  deleteQuiz(id: string): void {
    console.log(id);
    this.quizsService.deleteQuizById(id).subscribe({
      next: () => {
        this.quizs = this.quizs.filter(quiz => quiz.id !== id);
      },
      error: (err) => {
        console.error('Error deleting quiz:', err);
      }
    });
  }
  

}
