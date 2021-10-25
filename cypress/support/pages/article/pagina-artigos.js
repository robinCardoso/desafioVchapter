class ArticleLike {

    clicandoParaDarLikeOuDeslike(actionButton) {

        cy.get('h1[ng-bind="$ctrl.article.title"]').each(($artigos) => {
            const tituloArtigo = [];

            tituloArtigo.push($artigos.text());

            for (let artigo of tituloArtigo) {
                cy.wait(200);
                cy.get('h1[ng-bind="$ctrl.article.title"]').contains(artigo)
                    .parent()
                    .parent()
                    .find('div')
                    .find('ng-transclude')
                    .find('favorite-btn')
                    .find('button').as('like').invoke('attr', 'class').then($like => {
                        cy.wait(200);
                        if ($like == actionButton) {
                            cy.get('@like').click();
                            cy.log('Cliando like no artigo');
                        };
                    });
            };
        })
    };

    acessarPaginasDeArtigos(actionButton) {

        cy.visit('login');

        /* Acessando Feed */
        cy.get('div.feed-toggle').contains('Global Feed').click();

        /* Verificando quantidade de paginas */
        cy.get('a[class="page-link ng-binding"]').each(($paginas) => {
            if ($paginas != undefined) {
                const pagina = []
                pagina.push($paginas.text());

                cy.log(pagina)

                for (let PG of pagina) {

                    if (pagina > 2) {

                        /* Acessando pagina */
                        cy.get('a[class="page-link ng-binding"]').contains(`${PG}`).click();

                        /* Pagina tem delay para carregar.. */
                        cy.wait(2000);

                        /* Verifica se foi clicado na pagina correta */
                        cy.get('li[class="page-item ng-scope active"]').contains(`${PG}`).then(() => {

                            this.clicandoParaDarLikeOuDeslike(actionButton);
                        });
                    }else {
                        this.clicandoParaDarLikeOuDeslike(actionButton);
                    }
                };
            };
        });
    };
};

export default new ArticleLike();