import { Question } from "./question.model";

export class Quiz {
    id!: string;
    name!: string;
    description!: string;
    questions!: Question[];
    totalQuestions!: number ;

    
    constructor(name: string, description: string,questions: Question[]) {
        this.id=crypto.randomUUID().substring(0, 8);
        this.name = name;   
        this.description = description;
        this.questions = questions;
        this.totalQuestions = questions.length;
    }


}