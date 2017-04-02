((global, undefined) => {


    let article = document.getElementById('article');

    // Pluck expected parts from the page
    let img = article.querySelector(".content__main figure"),
        header = article.querySelector(".content__headline"),
        content = article.querySelector(".content__article-body"),
        newPage = document.createElement('div'),
        newContainer = document.createElement('div');

    // Append the title and content
    newPage.appendChild(img);
    newPage.appendChild(header);
    newPage.appendChild(content);

    // To control the css of the new container
    newPage.className = 'pure-content';
    newContainer.className = 'pure-container';
    newContainer.appendChild(newPage);

    // TODO: For the time being, a voilent method to replace the content.
    document.body.innerHTML = '';
    document.body.appendChild(newContainer);


    let removeDomByList = (list) => {
        if (list.join === undefined) {
            list = [];
        }
        document.querySelectorAll(list.join(", ")).forEach((ele) => {
            ele.remove();
        });
    };
    // Dirties in content body.
    const SomethingBad = [
        "aside.element-rich-link", // Aside ads
        "div.js-ad-slot",
        "div.block-share" // Buttons for sharing
    ];
    removeDomByList(SomethingBad);


    // The following is to watch on the dymanic loading ads.
    // Quite annoying
    const SomethingTough = [
        "div.js-ad-slot"
    ];

    // HACK: Remove ads and redundant content by observing mutation
    let target = document.querySelector('.content__article-body');
    let articleObserver = new MutationObserver(() => {
        removeDomByList(SomethingTough);
    });

    articleObserver.observe(target, {
      childList: true
    });

    let removeExceptClassName = (className) => {
        document.body.childNodes.forEach((e) => {
            if (!e.className.includes(className)) {
                e.remove();
            }
        });
    };

    let bodyObserver = new MutationObserver(() => {
        removeExceptClassName("pure-container");
    });

    bodyObserver.observe(document.body, {
        childList: true
    });

})(typeof window !== 'undefined' ? window : this);
