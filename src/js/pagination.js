((global, undefined) => {
    let JPage = require('./JPage');
    require('smoothscroll-polyfill').polyfill();

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

    let calcCurrentPage = () => {
        let viewHeight = calcViewHeight(),
            currentTop = document.body.scrollTop;
        return Math.floor(currentTop / viewHeight) + 1;
    };

    resizeContentHeight();
    let jpage = new JPage(btnContainer, calcPageCount(), calcCurrentPage());

    let refreshCurrentIndex = () => {
        let newPageNum = calcCurrentPage();
        if (newPageNum !== jpage.currentPage) {
            jpage.setCurrentPage(newPageNum);
        }
    };

    // Maybe it's in the somewhere middle of the page
    refreshCurrentIndex();

    // Scroll to specified place when click the following buttons for pagination
    jpage.onchange((num) => {
        let viewHeight = calcViewHeight();
        let targetScrollTop = (num - 1) * viewHeight;
        window.scroll({
            top: targetScrollTop,
            left: 0,
            behavior: 'smooth'
        });
    });

    // Refresh the active index when scrolling
    document.addEventListener('scroll', () => {
        refreshCurrentIndex();
    });

    // Reflow the work after the window resized.
    window.addEventListener('resize', () => {
        resizeContentHeight();
        jpage.setPageCount(calcPageCount());
        refreshCurrentIndex();
    });
})(typeof window !== 'undefined' ? window : this);
