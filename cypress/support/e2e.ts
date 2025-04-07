// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      openIngModal(ingName: string): Chainable<void>;
      interceptIngredientsAPI(): Chainable<void>;
      shouldNotExistOrNotContain(
        selector: string,
        text: string
      ): Chainable<void>;
      addIngToConstructor(ingType: string, ingName: string): Chainable<void>;
      //   drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //   dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
      //   visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
    }
  }
}
