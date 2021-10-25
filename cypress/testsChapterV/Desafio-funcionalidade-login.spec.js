/// <reference types="cypress"/>

import el from '../support/pages/elements';

describe('Verificando funcionalidade da pagina de login', () => {

    it('Verificar mensagem de erro para: e-mail ou senha incorreto', () => {

        cy.intercept({
            method: 'POST',
            path: '/api/users/login'
        }, {
            statusCode: 403,
            fixture: 'pages/login/senha-email-incorretos.json',
        }).as('postUsersLogin');

        /* Acessar Link para login */
        cy.visit('login');

        /* Digitar Email */
        cy.get(el.MENU_LOGIN.inputEmail).type('emailErrado@gmail.com');
        /* Digitar Senha */
        cy.get(el.MENU_LOGIN.inputPassword).type('senhaErrada');

        /* Submeter login */
        cy.get(el.MENU_LOGIN.buttonSubmit).click();

        /* Verificar mensagem de Erro */
        cy.get(el.MENU_LOGIN.msgError).contains('email or password is invalid');
    });

    it('Verificar mensagem de erro para: e-mail não informado', () => {
        cy.intercept({
            method: 'POST',
            path: '/api/users/login'
        }, {
            statusCode: 422,
            fixture: 'pages/login/email-nao-informado.json',
        }).as('postUsersLogin');

        /* Acessar Link para login */
        cy.visit('login');

        /* Digitar Senha */
        cy.get(el.MENU_LOGIN.inputPassword).type('senhaErrada');

        /* Submeter login */
        cy.get(el.MENU_LOGIN.buttonSubmit).click();

        /* Verificar mensagem de Erro */
        cy.get(el.MENU_LOGIN.msgError).contains("email can't be blank");
    });
});