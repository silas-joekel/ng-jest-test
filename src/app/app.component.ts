import { Component } from "@angular/core";
import { BehaviorSubject } from "rxjs";

type Todo = {
  title: string;
};

export const mockTodos = [
  { title: "Learn Angular" },
  { title: "Add testing with Jest" },
  { title: "Have fun" },
];

@Component({
  selector: "app-root",
  template: `
    <button (click)="addTodo()">Add Todo</button>
    <ul>
      <li *ngFor="let todo of todos$ | async">
        {{ todo.title }}
        <button (click)="removeTodo(todo)">X</button>
      </li>
    </ul>
  `,
  styles: [],
})
export class AppComponent {
  private _todos = new BehaviorSubject<Todo[]>(mockTodos);
  todos$ = this._todos.asObservable();

  addTodo(): void {
    const currentTodos = this._todos.getValue();

    if (currentTodos.length === 0) {
      const newTodos = [{title: 'First Todo \\( ﾟヮﾟ)/'}]
      this._todos.next(newTodos);
    } else {
      const additionalTodo = {title: `Todo #${currentTodos.length}`};
      const newTodos = currentTodos.concat(additionalTodo);
      this._todos.next(newTodos);
    }
  }

  removeTodo(todo: Todo): void {
    const currentTodos = this._todos.getValue();

    /*
     * With this implementation there may be cases
     * where multiple todos with the same title are deleted.
     * In production one should use unique ids.
     */
    const newTodos = currentTodos.filter(t => t.title !== todo.title);

    this._todos.next(newTodos);
  }
}
