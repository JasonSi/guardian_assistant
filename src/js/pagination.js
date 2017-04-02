((global, undefined) => {
    let JPage = require('./JPage');

    let pureContainer = document.querySelector("div.pure-container"),
        pureContent = document.querySelector("div.pure-content"),
        btnContainer = document.createElement('div');

    btnContainer.className = 'btn-container';
    pureContainer.appendChild(btnContainer);

    // Calculate the height of the viewable area.
    let calcViewHeight = () => {
        let screenHeight = document.documentElement.clientHeight,
            btnContainerHeight = btnContainer.clientHeight;
        return (screenHeight - btnContainerHeight);
    };

    // Resize the content height to fit in the last page.
    let resizeContentHeight = () => {
        pureContent.style.height = '';
        let contentHeight = pureContent.clientHeight;
        let count = Math.ceil(contentHeight / calcViewHeight());
        pureContent.style.height = count * calcViewHeight() + btnContainer.clientHeight + 'px';
    };

    // After resizing content's height, calculate the count of total pages.
    let calcPageCount = () => {
        let contentHeight = pureContent.clientHeight,
            btnHeight = btnContainer.clientHeight;
        return Math.round((contentHeight - btnHeight) / calcViewHeight());
    };

    resizeContentHeight();
    let jpage = new JPage(btnContainer, calcPageCount());

    jpage.onchange((num) => {
        let viewHeight = calcViewHeight();
        document.body.scrollTop = (num - 1) * viewHeight;
    });

    let refreshCurrentIndex = () => {
        let viewHeight = calcViewHeight();
        let currentTop = document.body.scrollTop;
        let newPageNum = Math.floor(currentTop / viewHeight) + 1;
        if (newPageNum !== jpage.currentPage) {
            jpage.setCurrentPage(newPageNum);
        }
    }

    // Refresh the active index when scrolling
    document.body.onscroll = () => {
        refreshCurrentIndex();
    };

    // Reflow the work after the window resized.
    window.onresize = () => {
        resizeContentHeight();
        let pageCount = calcPageCount();
        jpage.setPageCount(pageCount);
        refreshCurrentIndex();
    };
})(typeof window !== 'undefined' ? window : this);
