import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mockTodos } from './app.interface';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        providers: [AppService]
      }).compileComponents();
    }),
  );

  beforeEach(() => {
    service = TestBed.inject(AppService);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('addTodo', () => {
    it('should append one todo containing the previous length of the array as number', done => {
      service.addTodo();
      
      service.todos$.subscribe(todos => {
        expect(todos).toEqual([...mockTodos, {title: 'Todo #3'}]);
        done();
      });
    });

    it('should add item with title \'First Todo \\( ﾟヮﾟ)/\' if todos array is empty', done => {
      service['_todos'].next([]);

      service.addTodo();

      service.todos$.subscribe(todos => {
        expect(todos).toEqual([{title: 'First Todo \\( ﾟヮﾟ)/'}]);
        done();
      });
    });
  });

  describe('removeTodo', () => {
    it('should filter out todo by title', done => {
      service.removeTodo(mockTodos[1]);

      service.todos$.subscribe(todos => {
        // New array should only contain the first and third todo, not the second one
        expect(todos).toEqual([mockTodos[0], mockTodos[2]]);
        done();
      });
    })
  });
});