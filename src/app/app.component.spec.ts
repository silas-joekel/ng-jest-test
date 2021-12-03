import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent, Todo } from './app.component';

export const mockTodos: Todo[] = [
  { title: "Learn Angular" },
  { title: "Add testing with Jest" },
  { title: "Have fun" },
];

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [AppComponent]
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addTodo', () => {
    it('should append one todo containing the previous length of the array as number', () => {
      const todosGetValueSpy = jest.spyOn(component['_todos'], 'getValue').mockReturnValue(mockTodos);
      const todosNextSpy = jest.spyOn(component['_todos'], 'next').mockImplementation();

      component.addTodo();

      expect(todosGetValueSpy).toBeCalledTimes(1);
      expect(todosNextSpy).toBeCalledTimes(1);
      expect(todosNextSpy).toBeCalledWith([...mockTodos, {title: 'Todo #3'}]);
    });

    it('should add item with title \'First Todo \\( ﾟヮﾟ)/\' if todos array is empty', () => {
      const todosGetValueSpy = jest.spyOn(component['_todos'], 'getValue').mockReturnValue([]);
      const todosNextSpy = jest.spyOn(component['_todos'], 'next').mockImplementation();

      component.addTodo();

      expect(todosGetValueSpy).toBeCalledTimes(1);
      expect(todosNextSpy).toBeCalledTimes(1);
      expect(todosNextSpy).toBeCalledWith([{title: 'First Todo \\( ﾟヮﾟ)/'}]);
    });
  });

  describe('removeTodo', () => {
    it('should filter out todo by title', () => {
      const todosGetValueSpy = jest.spyOn(component['_todos'], 'getValue').mockReturnValue(mockTodos);
      const todosNextSpy = jest.spyOn(component['_todos'], 'next').mockImplementation();

      component.removeTodo(mockTodos[1]);

      expect(todosGetValueSpy).toBeCalledTimes(1);
      expect(todosNextSpy).toBeCalledTimes(1);
      // New array should only contain the first and third todo, not the second one
      expect(todosNextSpy).toBeCalledWith([mockTodos[0], mockTodos[2]]);
    })
  })
});