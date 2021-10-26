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
            cy.visit('editor/');
            cy.wait(500);
            const NumberArticle = this.NumberArticleGenerator(0, 500000);
            cy.get(el.MENU_ARTICLE.inputTitle).type(`Criando Artigo: Deletar ${NumberArticle}`);
            cy.get(el.MENU_ARTICLE.inputDescription).type('Artigo para teste Deletar');
            cy.get(el.MENU_ARTICLE.inputBody).type('Deletar este arquivo.');
            cy.get(el.MENU_ARTICLE.inputTag).type('#ArtigoDeletar');

            this.submeterArtigo();
            cy.get('h1.ng-binding').contains(`Criando Artigo: Deletar ${NumberArticle}`);
        };
    };

    clicarGlobalFeeds() {
        cy.get('div.feed-toggle').contains('Global Feed').click();
    };

    acessarArtigoEDeletar() {

        cy.get(el.MENU_ARTICLE.viewMsg).invoke('text').then($noArticle => {
            cy.wait(500);

            const msgError = $noArticle.trim(); /* trim() - Retira espaços vazios */

            if (msgError != 'No articles are here... yet.') {

                cy.get(el.MENU_ARTICLE.titleArticle).should('be.visible').each($artigos => {
                    const tituloArtigo = [];

                    tituloArtigo.push($artigos.text());

                    for (let artigo of tituloArtigo) {

                        cy.get(el.MENU_ARTICLE.titleArticle).contains(artigo).click();
                        this.buttonDeletarArtigo();
                        this.clicarGlobalFeeds();

                        cy.log('Clicando no feed pelo for artigo');
                    };
                });
                this.verificarSeTemMaisArtigos();
            } else {
                cy.log('Todos os artigos foram excluidos: acessarArtigoEDeletar!');
            }
        });
    };

    verificarSeTemMaisArtigos() {

        this.clicarGlobalFeeds();

        cy.contains('Loading articles...').should('not.be.visible').then(() => {

            cy.wait(2000);

            cy.get(el.MENU_ARTICLE.viewMsg).invoke('text').then($noArticle => {

                const msgError = $noArticle.trim(); /* trim() - Retira espaços vazios */

                cy.log(msgError);

                if (msgError == 'No articles are here... yet.') {
                    cy.log('Todos os artigos foram excluidos: verificarSeTemMaisArtigos!');
                } else {
                    this.acessarArtigoEDeletar();
                }
            })
        })
    };

    deletarTodosOsArtigos() {
        cy.visit('');

        this.verificarSeTemMaisArtigos();
    };
};

export default new Article();