import { DebugElement } from "@angular/core";
import { waitForAsync, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { MockedComponentFixture, MockInstance, MockProvider, MockRender, MockReset } from "ng-mocks";
import { of } from "rxjs";
import { AppComponent } from "./app.component";
import { mockTodos } from "./app.interface";
import { AppService } from "./app.service";

const getNonNestedTextContent = (element: DebugElement) => {
  const children = element.nativeElement.childNodes as Record<string, ChildNode>;
  return Object.keys(children)
    .map(key => children[key])
    .reduce<string>((text: string, node: ChildNode) => {
      if (node.nodeType !== 3) return text;
      return text + node.textContent;
    }, '');
}

const byContent = (content: string) =>
  (element: DebugElement) =>
    getNonNestedTextContent(element).includes(content)

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

    it.each(mockTodos.map(mock => mock.title))("Todo '%s' should be visible", (title) => {
      const todoElement = fixture.debugElement.query(byContent(title));
  
      expect(todoElement).not.toBeNull();
    });

    it("should not contain unknown todo item", () => {
      const todoElement = fixture.debugElement.query(byContent('Nothing to do'));
  
      expect(todoElement).toBeNull();
    });
  });

  describe('actions', () => {
    beforeEach(() => {
    fixture = MockRender(AppComponent);
  })
    it("should call service.addTodo when 'Add Todo' button is clicked", () => {
      const addTodoSpy = jest.spyOn(TestBed.inject(AppService), 'addTodo');
  
      const addButton = fixture.debugElement.query(byContent('Add Todo'));
      addButton.nativeElement.click();
      fixture.detectChanges();
  
      expect(addTodoSpy).toHaveBeenCalledTimes(1);
    });
  
    it("should call service.removeTodo when X button was clicked on a the second todo item", () => {
      const removeTodoSpy = jest.spyOn(TestBed.inject(AppService), 'removeTodo');
  
      const removeButton = fixture.debugElement.query(byContent(mockTodos[1].title)).query(byContent('X'));
      removeButton.nativeElement.click();
      fixture.detectChanges();
  
      expect(removeTodoSpy).toHaveBeenCalledTimes(1);
      expect(removeTodoSpy).toHaveBeenCalledWith(mockTodos[1]);
    });
  })
});