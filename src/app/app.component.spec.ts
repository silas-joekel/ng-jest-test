import { waitForAsync, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { MockedComponentFixture, MockInstance, MockProvider, MockRender, MockReset } from "ng-mocks";
import { of } from "rxjs";
import { AppComponent } from "./app.component";
import { mockTodos } from "./app.interface";
import { AppService } from "./app.service";

describe("AppComponent", () => {
  let fixture: MockedComponentFixture<AppComponent>

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [MockProvider(AppService)]
    }).compileComponents();

    MockInstance(AppService, 'todos$', of(mockTodos));
  }));

  afterEach(() => {
    MockReset();
  })

  it("should create", () => {
    const fixture = MockRender(AppComponent);

    expect(
      fixture.point.componentInstance,
    ).toBeInstanceOf(AppComponent);
  });

  describe('todo list', () => {
    beforeEach(() => {
      fixture = MockRender(AppComponent);
    })

    it('should contain 1 li element per todo item', () => {
      
      const listElements = fixture.debugElement.queryAll(By.css("li"));

      expect(listElements.length).toBe(mockTodos.length);
    });
    it.each([
      [mockTodos[0].title, 0],
      [mockTodos[1].title, 1],
      [mockTodos[2].title, 2],
    ])("'%s' should be at index %d in the list", (title, index) => {
      const listElements = fixture.debugElement.queryAll(By.css("li"));
  
      expect(listElements[index].nativeElement.textContent).toContain(title);
    });
  });

  describe('actions', () => {
    beforeEach(() => {
    fixture = MockRender(AppComponent);
  })
    it("should call service.addTodo when 'Add Todo' button is clicked", () => {
      const addTodoSpy = jest.spyOn(TestBed.inject(AppService), 'addTodo');
  
      const addButton = fixture.debugElement.query(By.css('button'));
      addButton.nativeElement.click();
      fixture.detectChanges();
  
      expect(addTodoSpy).toHaveBeenCalledTimes(1);
    });
  
    it("should call service.removeTodo when X button was clicked on a list element", () => {
      const removeTodoSpy = jest.spyOn(TestBed.inject(AppService), 'removeTodo');
  
      const removeButton = fixture.debugElement.queryAll(By.css("li"))[1].query(By.css("button"));
      removeButton.nativeElement.click();
      fixture.detectChanges();
  
      expect(removeTodoSpy).toHaveBeenCalledTimes(1);
      expect(removeTodoSpy).toHaveBeenCalledWith(mockTodos[1]);
    });
  })
});