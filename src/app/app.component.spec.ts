import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { AppComponent, Todo } from "./app.component";

export const mockTodos: Todo[] = [
  { title: "Learn Angular" },
  { title: "Add testing with Jest" },
  { title: "Have fun" },
];

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe('todos', () => {
    it.each([
      ["Learn Angular", 0],
      ["Add testing with Jest", 1],
      ["Have fun", 2],
    ])("'%s' should be at index %d in the list", (title, index) => {
      const listElements = fixture.debugElement.queryAll(By.css("li"));
  
      expect(listElements[index].nativeElement.textContent).toContain(title);
    });
  });

  describe("addTodo", () => {
    it("should append one todo containing the previous length of the array as number", () => {
      const addButton = fixture.debugElement.query(By.css('button'));
      addButton.nativeElement.click();
      fixture.detectChanges();

      const listElements = fixture.debugElement.queryAll(By.css("li"));
      expect(listElements.length).toBe(4);
      const newElement = listElements[3];
      expect(newElement.nativeElement.textContent).toContain("Todo #3");
    });

    it("should add item with title 'First Todo' if todos array is empty", () => {
      fixture.debugElement.queryAll(By.css("li")).forEach(listElement => {
        const removeButton = listElement.query(By.css("button"));
        removeButton.nativeElement.click();
        fixture.detectChanges();
      })
      
      const addButton = fixture.debugElement.query(By.css('button'));
      addButton.nativeElement.click();
      fixture.detectChanges();

      const listElements = fixture.debugElement.queryAll(By.css("li"));
      expect(listElements.length).toBe(1);
      const newElement = listElements[0];
      expect(newElement.nativeElement.textContent).toContain("First Todo");
    });
  });

  describe("removeTodo", () => {
    it("should remove second todo item on X click", () => {
      const removeButton = fixture.debugElement.queryAll(By.css("li"))[1].query(By.css("button"));
      removeButton.nativeElement.click();
      fixture.detectChanges();

      const listElements = fixture.debugElement.queryAll(By.css("li"));
      expect(listElements.length).toBe(2);
      expect(listElements[1].nativeElement.textContent).toContain("Have fun");
    });
  });
});
