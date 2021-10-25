const elementos = {
    DADOS: {
        userName: 'chapterVrobi',
        email: 'chapterVrobi@gmail.com',
        passWord: 'robi759153'
    },
    MENU_LOGIN :{
        inputUserName : 'input[placeholder="Username"]',
        inputEmail : 'input[placeholder="Email"]',
        inputPassword: 'input[placeholder="Password"]',
        buttonSubmit: 'button[type="submit"]',
        msgError: '[class="ng-binding ng-scope"]'
    },
    MENU_ARTICLE: {
        inputTitle: 'input[ng-model*="title"]',
        inputDescription: 'input[ng-model*="description"]',
        inputBody: 'textarea[ng-model*="body"]',
        inputTag: 'input[ng-model*="tagField"]',
        buttonDeletar: 'div [class="banner"] button[ng-click*="deleteArticle"]',
        buttonEditar: 'div [class="banner"] a[href*="#/editor"]',
        cliqueLike : 'btn btn-sm btn-outline-primary',
        cliqueDeslike : 'btn btn-sm btn-primary'
    }
};

export default elementos;