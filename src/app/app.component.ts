import { Component } from "@angular/core";
import { Todo } from "./app.interface";
import { AppService } from "./app.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
})
export class AppComponent {
  todos$ = this.service.todos$;

  constructor(private readonly service: AppService) {}

  addTodo(): void {
    this.service.addTodo();
  }

  removeTodo(todo: Todo): void {
    this.service.removeTodo(todo);
  }
}
