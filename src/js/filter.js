(function(global, undefined) {
    let article = document.getElementById('article');

    // Pluck expected parts from the page
    let img = article.querySelector(".content__main figure");
    let header = article.querySelector(".content__headline");
    let content = article.querySelector(".content__article-body");
    let newPage = document.createElement('div');

    // Append the title and content
    newPage.appendChild(img);
    newPage.appendChild(header);
    newPage.appendChild(content);

    // To control the css of the new container
    newPage.className = 'pure-content';

    // TODO: For the time being, a voilent method to replace the content.
    document.body.innerHTML = '';
    document.body.appendChild(newPage);

    // Dirties in content body.
    let SomethingBad = [
        "aside.element-rich-link", // Aside ads
        "div.block-share" // Buttons for sharing
    ];
    document.querySelectorAll(SomethingBad.join(", ")).forEach((ele) => {
        ele.remove();
    });

    // TODO: "div.js-ad-slot"   Google dynamic ads

})(typeof window !== 'undefined' ? window : this);
