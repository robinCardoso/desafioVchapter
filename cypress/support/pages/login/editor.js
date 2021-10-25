import el from '../elements';
let articleNameEdit = 'Editando o Artigo: ' + new Date().getTime();

class Article {

    NumberArticleGenerator(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    verificarUsuario() {
        cy.contains(el.DADOS.userName).should('be.visible');
    };

    criandoNovoArtigo() {
        const NumberArticle = this.NumberArticleGenerator(0, 50000);
        cy.get(el.MENU_ARTICLE.inputTitle).type(`Criando Artigo: ${NumberArticle}`);
        cy.get(el.MENU_ARTICLE.inputDescription).type('Artigo para validação');
        cy.get(el.MENU_ARTICLE.inputBody).type('Intensão do teste é criar um novo arquivo preenchendo todos os campos necessários.');
        cy.get(el.MENU_ARTICLE.inputTag).type('#novoArtigo');

        this.submeterArtigo();
        cy.wait(1000);

        /* Verifica se o nome do artigo esta visivel */
        cy.get('h1.ng-binding').contains(`Criando Artigo: ${NumberArticle}`);
    };

    criandoNovoArtigoEditado() {
        cy.get(el.MENU_ARTICLE.inputTitle).clear().type(articleNameEdit);
        cy.get(el.MENU_ARTICLE.inputDescription).clear().type('Teste para edição do artigo');
        cy.get(el.MENU_ARTICLE.inputBody).clear().type('Este artigo foi criado para teste de edição');
        cy.get(el.MENU_ARTICLE.inputTag).type('#ArtigoEditado');

        this.submeterArtigo();
    };

    submeterArtigo() {
        /* Submeter Artigo*/
        cy.get('button').contains('Publish Article').click();
    };

    buttonDeletarArtigo() {
        cy.get(el.MENU_ARTICLE.buttonDeletar).click();
    };

    buttonEditarArtigo() {
        cy.get(el.MENU_ARTICLE.buttonEditar).click();
    };

    loopCriacaoDeArtigos(qtd) {
        for (let i = 0; i < qtd; i++) {
            const NumberArticle = this.NumberArticleGenerator(0, 500000);
            cy.visit('editor/')
            cy.get(el.MENU_ARTICLE.inputTitle).type(`Criando Artigo: Curtir ${NumberArticle}`);
            cy.get(el.MENU_ARTICLE.inputDescription).type('Artigo para teste Curtir');
            cy.get(el.MENU_ARTICLE.inputBody).type('Intensão do teste é criar um novo arquivo preenchendo todos os campos necessários para curtir.');
            cy.get(el.MENU_ARTICLE.inputTag).type('#ArtigoCurtir');

            this.submeterArtigo();

            cy.wait(1000);
            cy.get('h1.ng-binding').contains(`Criando Artigo: Curtir ${NumberArticle}`);
        }
    };

    clicarGlobalFeeds() {

        cy.get('div.feed-toggle').contains('Global Feed').click();
    };

    deletarTodosOsArtigos() {
        cy.visit('login');
        /* Acessando Feed */
        cy.get('div.feed-toggle').contains('Global Feed').click();

        /* Verificar quantidade de paginas de artigos */
        cy.get('a[class="page-link ng-binding"]').each(() => {

            cy.get('h1[ng-bind="$ctrl.article.title"]').should('be.visible').then(() => {

                cy.get('h1[ng-bind="$ctrl.article.title"]').each(($artigos) => {
                    const tituloArtigo = [];

                    tituloArtigo.push($artigos.text());

                    for (let artigo of tituloArtigo) {

                        const tentativas = 10;

                        cy.get('div[class="article-preview"]').invoke('text').then($noArticle => {
                            for (let i = 0; i < tentativas; i++) {
                                if ('No articles are here... yet.' == $noArticle) {
                                    this.clicarGlobalFeeds();
                                    cy.log(`Numero de tentativa: ${tentativas}`);
                                } else {
                                    cy.get('h1[ng-bind="$ctrl.article.title"]').contains(artigo).click();
                                    cy.wait(500);
                                    this.buttonDeletarArtigo();

                                    this.clicarGlobalFeeds();
                                }
                            };
                        });
                    };
                });
            });
        })
    };

};

export default new Article();