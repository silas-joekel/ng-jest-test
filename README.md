# NgJestTest

This repo contains a very basic Angular App which is used to improve my testing skills.

## Motivation

I have already been writing tests at work for some time now, but it never felt as clean and directed as I wanted it to be.
With this project I want to document what different testing strategies come to my mind and what advantages and disadvantages they have.
I'm hoping that in the end I will have a better understanding of unit tests and how to approach them.
Furthermore I want to find out how TDD fits into my learnings.

## My Approach

For now this is only about component testing because that's the part of Angular where I feel the most shaky about.
I guess this is mainly due to the fact, that it contains more than just simple Typescript, but also HTML and CSS.

In general with every strategy I try to reach 100% test coverage for the component.

If you run `ng test` on the main branch, you will see that it fails and tells you that the test coverage is too low. There is only a single test that just renders the component once. Interestingly the coverage for the html file is already at 100%. For the ts file this is not the case and that's where we will try to improve with the different strategies.

### 1. Direct function calls and property access

Link: [function testing strategy](https://github.com/silas-joekel/ng-jest-test/tree/testing/strategy-1%2Ffunction-testing)

Idea: To reach 100% test coverage every function, branch and statement has to be executed. Therefor we directly call the functions and expect some functions to be called or some state to be changed.

Result: Reaching the coverage goal was pretty easy and straight-forward. A major disadvantage is that the template is not even used within the tests. Therefor in theory the component could just display a meme instead of the todos and the tests would still pass, I guess that's not what I want :D

### 2. Template testing

Link: [template testing strategy](https://github.com/silas-joekel/ng-jest-test/tree/testing/strategy-2%2Ftemplate-testing)

Idea: To address the problem of strategy 1 of not including the template in the tests, the goal of strategy 2 is to avoid direct function calls and instead trigger them by interacting with the html.

Result: This strategy felt much more productive than the first one and it definitely solved the problem from before. What i don't like here is the hard coupling of the test to the template structure. As soon as someone uses another element than li for the todo items, the test would also need to be adapted. I'm currently not sure how this could be improved, so I guess I have to do some research on that. In Cypress e2e tests there is an option to search for some text, something similar to this would come in handy here.

Extra: For the 'addTodo' test I mocked the todos array to be empty, so that all branches are walked through in the tests. Accessing a private property of the component did not feel right to me, so in [here](https://github.com/silas-joekel/ng-jest-test/tree/testing/strategy-2+%2Fprevent-property-access) I instead removed all initial items via their remove button. The downside of this is, that the addTodo test would only work if the removeTodo part is working.

### 3. Prevent component state

Link: [prevent component state strategy](https://github.com/silas-joekel/ng-jest-test/tree/testing/strategy-3%2Fprevent-component-state)

Idea: Setting up the state in strategy 2 seemed annoying somehow. I think setup is definitely important and needed in every test suite, but at least for components there might not be a need for having state in the first place. In production the state will probably not be some mocked values initally. Instead the state would either come from user interaction (like creating new todos) or from an external api (REST, local storage, etc.). Therefor I decided to move the state into a separate service and call its methods from the component.

Result: That approach simplified the component tests a lot since I only had to mock the service which is quite easy with Angular and Jest. For the service I wrote the tests similar to strategy 1 for components, just to keep it simple for now. Having a closer look at service testing may be a subject for the future.
One problem I have with the solution is mocking the observable inside the service. Sure I could have a stub with an rxjs subject to perform updates on the observable, but it doesn't feel that right to me since it involves some logic which I don't like to have in unit tests. In strategy 4 I will try to find a better solution.

### 4. Mock external dependencies with type checking

Link: [prevent component state strategy](https://github.com/silas-joekel/ng-jest-test/tree/testing/strategy-4%2Fmock-service)

Idea: I used ng-mocks before to test components. The mocks produced by the library are tightly coupled to their real implementations and the compilation fails if you try to pass a wrong input for example. So the idea here is to have similar mocking for services. I hope that ng-mocks provides easier ways to handle the mocking.

Result: Figuring out ng-mocks was pretty interesting to me. I like it better than mocking with jest spyOn. It's easy to manipulate the mocked services before injecting them into the component. This is a huge help.

### 5. Less tightly template coupling

Link: [prevent component state strategy](https://github.com/silas-joekel/ng-jest-test/tree/testing/strategy-5%2Fby-content)

Idea: In the past when I tried to do TDD with components, I already implemented half of the component when creating the tests. Also there were lots of assumptions (like this should be an li element) which I think should be prevented when writing the tests. When doing TDD I want to leave the how to the developer implementing it. I don't care if he uses ul or ol. So to achieve this my tests should focus more on the actual information displayed than on the structure of the html.

Result: After a little bit of research I found [Angular Predicate Documentation](https://angular.io/api/core/Predicate). So to achieve my goal of having structure independent unit tests I implemented a predicate function that matches the text inside an element. A little hurdle was that textContent by default returns also the content from child elements. To solve this I just filtered the children by their nodeType (which is 3 for texts) and accumulated their textContent properties.

## Retrospective

This project really helped me figure out some best practices for Angular Component Unit Tests. I feel a lot more confident when writing tests. I'm also able to point out some things about unit tests that I don't like and I found solutions for how to do better.