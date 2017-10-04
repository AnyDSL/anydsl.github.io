function initSearchBox(searchInput, resultsOutput, indexUrl) {

    SimpleJekyllSearch.init({
        searchInput: searchInput.get(0),
        resultsContainer: resultsOutput.get(0),
        json: indexUrl,
        searchResultTemplate: '<li class="drawer-list__item"><a href="{url}" class="drawer-list__link" title="{title}">{title}</a></li>',
        noResultsText: '<li class="drawer-list__item"><a href class="drawer-list__link">No Results found.</a></li>',
        limit: 10,
        fuzzy: false,
    });

    searchInput.keydown(function(event) {
        if (event.defaultPrevented) { return; }
        switch (event.key) {
            case 'Escape':
                searchInput.val('');
                break;
            case 'ArrowDown':
                var active = resultsOutput.find('li.drawer-list__item--highlight');
                if (active.get(0)) {
                    console.log('previous active found', active.get(0));
                    active.removeClass('drawer-list__item--highlight');
                    active = active.next('li.drawer-list__item');
                } else {
                    active = resultsOutput.find('li.drawer-list__item').first();
                }
                console.log(active.get(0));
                active.addClass('drawer-list__item--highlight');               
                break;
            case 'ArrowUp':
                var active = resultsOutput.find('li.drawer-list__item--highlight');
                if (active.get(0)) {
                    console.log('previous active found', active.get(0));
                    active.removeClass('drawer-list__item--highlight');
                    active = active.prev('li.drawer-list__item');
                } else {
                    active = resultsOutput.find('li.drawer-list__item').last();
                }
                console.log(active.get(0));
                active.addClass('drawer-list__item--highlight');               
                break;
            case 'Enter':
                var dest = resultsOutput.find('li.drawer-list__item--highlight').find('a').attr('href');
                if (dest) {
                    window.location.href = dest;
                }
                break;
            default:
                return;
        }
        event.preventDefault();
    });
}