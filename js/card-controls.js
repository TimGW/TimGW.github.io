(function () {
    'use strict';

    var STYLE_ID = 'card-controls-styles';
    var ENHANCED_CLASS = 'card--enhanced';
    var MINIMIZED_CLASS = 'card--minimized';
    var CLOSING_CLASS = 'card--closing';

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        var css = [
            /* Turn off the old pseudo-element chrome on cards we've enhanced */
            '.card.' + ENHANCED_CLASS + '::before,',
            '.card.' + ENHANCED_CLASS + '::after {',
            '    content: none;',
            '}',

            /* Real header bar, styled to match the old ::before title bar */
            '.card-header {',
            '    display: flex;',
            '    align-items: center;',
            '    justify-content: space-between;',
            '    height: 26px;',
            '    line-height: 26px;',
            '    padding: 0 8px 0 10px;',
            '    margin: -2rem -1.5rem 1.25rem;',
            '    background: linear-gradient(90deg, var(--panel-bg), color-mix(in srgb, var(--panel-bg) 60%, #000));',
            '    color: var(--panel-fg);',
            '    font-family: var(--font-mono);',
            '    font-size: 1.15rem;',
            '    letter-spacing: 0.08em;',
            '    border-bottom: 2px solid var(--line);',
            '    white-space: nowrap;',
            '    user-select: none;',
            '}',

            '.card-header-title {',
            '    flex: 1 1 auto;',
            '    min-width: 0;',
            '    overflow: hidden;',
            '    text-overflow: ellipsis;',
            '    white-space: nowrap;',
            '}',

            '.card-header-buttons {',
            '    flex: 0 0 auto;',
            '    display: flex;',
            '    align-items: center;',
            '    gap: 2px;',
            '    margin-left: 10px;',
            '}',

            '.card-header-buttons button {',
            '    font-family: var(--font-mono);',
            '    font-size: 1rem;',
            '    line-height: 1;',
            '    color: var(--panel-fg);',
            '    background: transparent;',
            '    border: none;',
            '    margin: 0;',
            '    padding: 3px 6px;',
            '    cursor: pointer;',
            '}',

            '.card-header-buttons button:hover {',
            '    background: rgba(255, 255, 255, 0.2);',
            '}',

            '.card-header-buttons button:active {',
            '    background: rgba(0, 0, 0, 0.2);',
            '}',

            /* Restore button looks/acts inert when the card isn\'t minimized */
            '.card:not(.' + MINIMIZED_CLASS + ') .card-header-buttons button[data-action="restore"] {',
            '    opacity: 0.45;',
            '    cursor: default;',
            '}',

            '.card:not(.' + MINIMIZED_CLASS + ') .card-header-buttons button[data-action="restore"]:hover {',
            '    background: transparent;',
            '}',

            /* Minimize button looks/acts inert once already minimized */
            '.card.' + MINIMIZED_CLASS + ' .card-header-buttons button[data-action="minimize"] {',
            '    opacity: 0.45;',
            '    cursor: default;',
            '}',

            '.card.' + MINIMIZED_CLASS + ' .card-header-buttons button[data-action="minimize"]:hover {',
            '    background: transparent;',
            '}',

            /* The animated body wrapper */
            '.card-body {',
            '    overflow: hidden;',
            '    transition: max-height 0.35s ease, opacity 0.3s ease;',
            '}',

            /* Card itself animates away on close */
            '.card.' + ENHANCED_CLASS + ' {',
            '    transition: background 0.2s, color 0.2s, max-height 0.3s ease, opacity 0.3s ease,',
            '                margin 0.3s ease, padding 0.3s ease, border-width 0.3s ease;',
            '}',

            '.card.' + CLOSING_CLASS + ' {',
            '    overflow: hidden;',
            '    opacity: 0;',
            '    margin-top: 0 !important;',
            '    margin-bottom: 0 !important;',
            '    padding-top: 0 !important;',
            '    padding-bottom: 0 !important;',
            '    border-width: 0 !important;',
            '}',

            /* Match the mobile header margin/padding used by the original ::before rules */
            '@media only screen and (max-width: 481px) {',
            '    .card-header {',
            '        margin: -1.75rem -1.0rem 1.25rem;',
            '    }',
            '}'
        ].join('\n');

        var styleEl = document.createElement('style');
        styleEl.id = STYLE_ID;
        styleEl.textContent = css;
        document.head.appendChild(styleEl);
    }

    function buildHeader(title) {
        var header = document.createElement('div');
        header.className = 'card-header';

        var titleEl = document.createElement('span');
        titleEl.className = 'card-header-title';
        titleEl.textContent = title || '';

        var buttons = document.createElement('div');
        buttons.className = 'card-header-buttons';
        buttons.innerHTML =
            '<button type="button" data-action="minimize" aria-label="Minimize">_</button>' +
            '<button type="button" data-action="restore" aria-label="Restore">\u25A1</button>' +
            '<button type="button" data-action="close" aria-label="Close">\u2715</button>';

        header.appendChild(titleEl);
        header.appendChild(buttons);
        return header;
    }

    function enhanceCard(card) {
        if (card.classList.contains(ENHANCED_CLASS)) return;

        var title = card.getAttribute('data-title') || '';

        // Move all existing content into a body wrapper so we can animate it
        // independently of the header.
        var body = document.createElement('div');
        body.className = 'card-body';
        while (card.firstChild) {
            body.appendChild(card.firstChild);
        }

        var header = buildHeader(title);

        card.appendChild(header);
        card.appendChild(body);
        card.classList.add(ENHANCED_CLASS);
    }

    function setMinimized(card, minimize) {
        var body = card.querySelector(':scope > .card-body');
        if (!body) return;

        var isMinimized = card.classList.contains(MINIMIZED_CLASS);
        if (minimize === isMinimized) return; // no-op: already in requested state

        if (minimize) {
            // Animate from current natural height down to 0.
            body.style.maxHeight = body.scrollHeight + 'px';
            // Force reflow so the browser registers the starting height
            // before we change it, otherwise it won't animate.
            // eslint-disable-next-line no-unused-expressions
            body.offsetHeight;

            requestAnimationFrame(function () {
                card.classList.add(MINIMIZED_CLASS);
                body.style.maxHeight = '0px';
                body.style.opacity = '0';
            });
        } else {
            card.classList.remove(MINIMIZED_CLASS);
            var targetHeight = body.scrollHeight;
            body.style.maxHeight = targetHeight + 'px';
            body.style.opacity = '1';

            var onEnd = function (event) {
                if (event.target !== body || event.propertyName !== 'max-height') return;
                body.removeEventListener('transitionend', onEnd);
                if (!card.classList.contains(MINIMIZED_CLASS)) {
                    // Let it size naturally afterwards (handles content/window changes).
                    body.style.maxHeight = 'none';
                }
            };
            body.addEventListener('transitionend', onEnd);
        }
    }

    function closeCard(card) {
        if (card.classList.contains(CLOSING_CLASS)) return;

        var startHeight = card.scrollHeight;
        card.style.maxHeight = startHeight + 'px';
        card.style.overflow = 'hidden';
        // Force reflow before animating to 0.
        // eslint-disable-next-line no-unused-expressions
        card.offsetHeight;

        requestAnimationFrame(function () {
            card.classList.add(CLOSING_CLASS);
            card.style.maxHeight = '0px';
        });

        var onEnd = function (event) {
            if (event.target !== card) return;
            card.removeEventListener('transitionend', onEnd);
            card.remove();
        };
        card.addEventListener('transitionend', onEnd);
    }

    function handleButtonClick(event) {
        var button = event.target.closest('.card-header-buttons button');
        if (!button) return;

        var card = button.closest('.card');
        if (!card) return;

        var action = button.getAttribute('data-action');
        if (action === 'minimize') {
            setMinimized(card, true);
        } else if (action === 'restore') {
            setMinimized(card, false);
        } else if (action === 'close') {
            closeCard(card);
        }
    }

    function init() {
        injectStyles();
        document.querySelectorAll('.card').forEach(enhanceCard);
        document.addEventListener('click', handleButtonClick);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exposed in case you add cards dynamically later.
    window.CardControls = {
        enhanceCard: enhanceCard,
        minimize: function (card) { setMinimized(card, true); },
        restore: function (card) { setMinimized(card, false); },
        close: closeCard
    };
})();