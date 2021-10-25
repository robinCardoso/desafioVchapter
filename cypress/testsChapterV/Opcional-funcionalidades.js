/// <reference types="cypress"/>
import el from '../support/pages/elements'

import Article from '../support/pages/login/editor';
import ArticleLike from '../support/pages/article/pagina-artigos';

describe('Verificando funcionalidade da pagina de registro', () => {
    it('Criando um novo cadastro: com sucesso', () => {

        cy.intercept({
            method: 'POST',
            path: '/api/users'

        }, {
            statusCode: 200,
            fixture: 'pages/register/cadastro-com-sucesso.json',
        }).as('postUsers');

        /* Acessar Link para registro */
        cy.visit('register');

        /* Digitar User Name */
        cy.get(el.MENU_LOGIN.inputUserName).type(el.DADOS.userName);
        /* Digitar Email */
        cy.get(el.MENU_LOGIN.inputEmail).type(el.DADOS.email);
        /* Digitar Senha */
        cy.get(el.MENU_LOGIN.inputPassword).type(el.DADOS.passWord);

        /* Submeter Registro */
        cy.get(el.MENU_LOGIN.buttonSubmit).click();

    });

    it('Verificar mensagem de erro para: Email ja cadastrado', () => {

        cy.intercept({
            method: 'POST',
            path: '/api/users'

        }, {
            statusCode: 422,
            fixture: 'pages/register/email-ja-cadastrado.json',
        }).as('postUsers');

        /* Acessar Link para registro */
        cy.visit('register');

        /* Digitar User Name */
        cy.get(el.MENU_LOGIN.inputUserName).type('UserName');
        /* Digitar Email */
        cy.get(el.MENU_LOGIN.inputEmail).type(el.DADOS.email);
        /* Digitar Senha */
        cy.get(el.MENU_LOGIN.inputPassword).type(el.DADOS.passWord);

        /* Submeter Registro */
        cy.get(el.MENU_LOGIN.buttonSubmit).click();

        /* Verificar mensagem de Erro */
        cy.get(el.MENU_LOGIN.msgError).contains('email has already been taken');

    });

    it('Verificar mensagem de erro para: Email e UserName ja cadastrado', () => {

        cy.intercept({
            method: 'POST',
            path: '/api/users'

        }, {
            statusCode: 422,
            fixture: 'pages/register/email-username-ja-cadastrado.json',
        }).as('postUsers');

        /* Acessar Link para registro */
        cy.visit('register');

        /* Digitar User Name */
        cy.get(el.MENU_LOGIN.inputUserName).type(el.DADOS.userName);
        /* Digitar Email */
        cy.get(el.MENU_LOGIN.inputEmail).type(el.DADOS.email);
        /* Digitar Senha */
        cy.get(el.MENU_LOGIN.inputPassword).type(el.DADOS.passWord);

        /* Submeter Registro */
        cy.get(el.MENU_LOGIN.buttonSubmit).click();

        /* Verificar mensagem de Erro */
        cy.get(el.MENU_LOGIN.msgError).invoke('text').then($error => {
            const erros = [];
            erros.push($error);
            cy.log(erros)
            cy.contains('email has already been taken username has already been taken')
        });

        /* Verificar mensagem de Erro */
        cy.contains('email has already been taken');
        cy.contains('username has already been taken');

    });

    it('Verificar mensagem de erro para: Email não informado', () => {

        cy.intercept({
            method: 'POST',
            path: '/api/users'

        }, {
            statusCode: 422,
            fixture: 'pages/login/email-nao-informado.json',
        }).as('postUsers');

        /* Acessar Link para registro */
        cy.visit('register');

        /* Digitar User Name */
        cy.get(el.MENU_LOGIN.inputUserName).type(el.DADOS.userName);

        /* Digitar Senha */
        cy.get(el.MENU_LOGIN.inputPassword).type(el.DADOS.passWord);

        /* Submeter Registro */
        cy.get(el.MENU_LOGIN.buttonSubmit).click();

        /* Verificar mensagem de Erro */
        cy.get(el.MENU_LOGIN.msgError).contains("email can't be blank")

    });

    it('Verificar mensagem de erro para: UserName não informado', () => {

        cy.intercept({
            method: 'POST',
            path: '/api/users'

        }, {
            statusCode: 422,
            fixture: 'pages/register/username-nao-informado.json',
        }).as('postUsers');

        /* Acessar Link para registro */
        cy.visit('register');

        /* Digitar Email */
        cy.get(el.MENU_LOGIN.inputEmail).type(el.DADOS.email);

        /* Digitar Senha */
        cy.get(el.MENU_LOGIN.inputPassword).type(el.DADOS.passWord);

        /* Submeter Registro */
        cy.get(el.MENU_LOGIN.buttonSubmit).click();

        /* Verificar mensagem de Erro */
        cy.get(el.MENU_LOGIN.msgError).contains("username can't be blank")

    });

});

describe('Testando funcionalidades de registro de artigos', () => {
    beforeEach(() => {
        cy.login();
        cy.visit('editor/');
    });

    it('Criando um novo artigo, e verificar se o nome do artigo esta visivel.', () => {

        Article.verificarUsuario();

        Article.criandoNovoArtigo();

        Article.submeterArtigo();

        Article.verificarSeOArtigoFoiCriado();

    });

    it('Criando um novo artigo, testar a ação de deletar artigo.', () => {

        cy.intercept({
            method: 'POST',
            url: 'https://api.realworld.io/api/articles',
        }, {
            statusCode: 200,
            fixture: 'pages/editor/deletar-artigo.json'
        }).as('postUsersArticle');

        cy.get(el.MENU_ARTICLE.inputTitle).type('DeletandoArtigo');
        cy.get(el.MENU_ARTICLE.inputDescription).type('DeletandoArtigo');
        cy.get(el.MENU_ARTICLE.inputBody).type('Este arquivo é um para testar button delete');
        cy.get(el.MENU_ARTICLE.inputTag).type('#DeletarArtigo');

        Article.submeterArtigo();

        cy.get('h1.ng-binding').contains('DeletandoArtigo');

        Article.deletarArtigo();

        /* 
        testar função de titulo em branco cy.get('li[class="ng-binding ng-scope"]').contains('')
        */
    });

    it('Criando um novo artigo: Testar mensagem de erro caso não tenha preenchido Titulo do artigo.', () => {

        cy.get(el.MENU_ARTICLE.inputDescription).type('Somente descrição do Artigo');
        cy.get(el.MENU_ARTICLE.inputBody).type('Este artigo esta em Titulo para testar msg de erro');
        cy.get(el.MENU_ARTICLE.inputTag).type('#ArtigoSemTitulo');


        Article.submeterArtigo();

        cy.get('li[class="ng-binding ng-scope"]').contains("title can't be blank");
    });

    it('Criando um novo artigo: Testar mensagem de erro caso não tenha preenchido Descrição do artigo.', () => {

        cy.get(el.MENU_ARTICLE.inputTitle).type('Somente titulo do artigo');
        cy.get(el.MENU_ARTICLE.inputBody).type('Este artigo esta em Descrição para testar msg de erro');
        cy.get(el.MENU_ARTICLE.inputTag).type('#ArtigoSemTitulo');


        Article.submeterArtigo();

        cy.get('li[class="ng-binding ng-scope"]').contains("description can't be blank");
    });

    it('Criando um novo artigo: Testar mensagem de erro caso não tenha preenchido o corpo do artigo.', () => {

        cy.get(el.MENU_ARTICLE.inputTitle).type('Somente titulo do artigo');
        cy.get(el.MENU_ARTICLE.inputDescription).type('Somente descrição do Artigo');
        cy.get(el.MENU_ARTICLE.inputTag).type('#ArtigoSemBody');


        Article.submeterArtigo();

        cy.get('li[class="ng-binding ng-scope"]').contains("body can't be blank");
    });

    it('Criando um novo artigo: Testando ação de editar artigo após criar.', () => {

        Article.verificarUsuario();

        Article.criandoNovoArtigo();

        Article.submeterArtigo();

        Article.verificarSeOArtigoFoiCriado();

        Article.editarArtigo();

        cy.get(el.MENU_ARTICLE.inputTitle).clear().type('Editando Artigo');
        cy.get(el.MENU_ARTICLE.inputDescription).clear().type('Teste para edição do artigo');
        cy.get(el.MENU_ARTICLE.inputBody).clear().type('Este artigo foi criado para teste de edição');
        cy.get(el.MENU_ARTICLE.inputTag).type('#ArtigoEditado');

        Article.submeterArtigo();

    });
});

describe('Testando a pagina GlobalFeed', () => {

    beforeEach(() => {
        cy.login();
        cy.visit('login');
    });

    it.only('Testando a função curtir artigo: Deve curtir todos os posts verificando todas as paginas de artigos.', () => {
        /* Acessando Feed */
        cy.get('div.feed-toggle').contains('Global Feed').click();

        ArticleLike.ArticleLike();
    });
});