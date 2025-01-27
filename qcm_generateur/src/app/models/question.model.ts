export class Question { 

    id: number;
    description: string;
    options: string[];
    correctAnswer: string;
 

    constructor(id:number, description: string, options: string[], correctAnswer: string) {
        this.id = id;
        this.description = description;
        this.options = options;
        this.correctAnswer = correctAnswer;

    }

}