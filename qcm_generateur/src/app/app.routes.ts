import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { ListQuizsComponent } from './list-quizs/list-quizs.component';
import { GenerateQuizComponent } from './generate-quiz/generate-quiz.component';
import { HttpClient} from '@angular/common/http';
import { EditQuizComponent } from './edit-quiz/edit-quiz.component';

export const routes: Routes = [
    {path:"", component:ListQuizsComponent},
    {path:"home", component:ListQuizsComponent},
    {path:"create", component:GenerateQuizComponent},
    {path:"edit/:id", component:EditQuizComponent},


];
