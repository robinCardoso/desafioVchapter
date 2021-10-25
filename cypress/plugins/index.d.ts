declare namespace Cypress {
    interface Chainable {

        /**
         * @example cy.login() - Request para acessar o token de login
         */
        login(): void

        /**
         * @example cy.token() - Inserindo token no localStorage
         */

        token(): void

    }
}