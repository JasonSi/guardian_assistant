((global, undefined) => {
    let genPaginator = () => {
        let JPage = require('./jpage');
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

        // Manully trigger it in case of being not at the top after reloaded
        refreshCurrentIndex();

        // A simple throttle to improve the performance
        let throttle = (func, wait, mustRun) => {
            let timeout,
                startTime = new Date();

            return () => {
                let context = this,
                    args = arguments,
                    currentTime = new Date();

                clearTimeout(timeout);
                // trigger the handler when time's out
                if (currentTime - startTime >= mustRun) {
                    func.apply(context, args);
                    startTime = currentTime;
                } else {
                    // reset the timer if throttled
                    timeout = setTimeout(func, wait);
                }
            };
        };


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
        window.addEventListener('scroll', throttle(refreshCurrentIndex, 200, 500));

        let refreshWhenResize = () => {
            resizeContentHeight();
            jpage.setPageCount(calcPageCount());
            refreshCurrentIndex();
        };
        window.addEventListener('resize', throttle(refreshWhenResize, 200, 500));
    };


    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = genPaginator;
    } else {
        global.genPaginator = genPaginator;
    }

})(typeof window !== 'undefined' ? window : this);
