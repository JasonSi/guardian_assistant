((global, undefined) => {

    let removeDomByList = (list) => {
        if(list.join === undefined){
          list = [];
        }
        document.querySelectorAll(list.join(", ")).forEach((ele) => {
            ele.remove();
        });
    };

    let article = document.getElementById('article');

    // Pluck expected parts from the page
    let img = article.querySelector(".content__main figure");
    let header = article.querySelector(".content__headline");
    let content = article.querySelector(".content__article-body");
    let newPage = document.createElement('div');
    let newContainer = document.createElement('div');

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

    // select the target node
    let target = document.querySelector('.content__article-body');
    let observer = new MutationObserver((mutations) => {
        removeDomByList(SomethingTough);
    });

    // configuration of the observer:
    let config = {
        childList: true,
        characterData: true
    };

    // pass in the target node, as well as the observer options
    observer.observe(target, config);


})(typeof window !== 'undefined' ? window : this);
