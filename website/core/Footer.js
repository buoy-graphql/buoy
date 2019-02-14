/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
    docUrl(doc, language) {
        const baseUrl = this.props.config.baseUrl;
        const docsUrl = this.props.config.docsUrl;
        const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
        const langPart = `${language ? `${language}/` : ''}`;
        return `${baseUrl}${docsPart}${langPart}${doc}`;
    }

    pageUrl(doc, language) {
        const baseUrl = this.props.config.baseUrl;
        return baseUrl + (language ? `${language}/` : '') + doc;
    }

    render() {
        return (
            <footer className="nav-footer" id="footer">
            <section className="sitemap">
            <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
            <img
        src={this.props.config.baseUrl + this.props.config.footerIcon}
        alt={this.props.config.title}
        width="66"
        height="58"
            />
    )}
    </a>
        <div>
        <h5>Documentation</h5>
        <a href={this.docUrl('getting-started/installation')}>
        Getting Started
        </a>
        <a href={this.docUrl('api-reference/lighthouse')}>
        API Reference
        </a>
        </div>
        <div>
        <h5>Community</h5>
        <a href={this.pageUrl('users')}>
        User Showcase
        </a>
        <a
        href="http://stackoverflow.com/questions/tagged/ngx-ligthouse"
        target="_blank"
        rel="noreferrer noopener">
            Stack Overflow
        </a>
        </div>
        <div>
        <h5>More</h5>
        <a target="new" href="https://github.com/alberthaff/ngx-lighthouse">GitHub</a>
        <a target="new" href="https://www.npmjs.com/package/ngx-lighthouse">NPM</a>
        <a href={this.props.config.repoUrl}
        className="github-button"
        data-icon="octicon-star"
        data-count-href="/alberthaff/lighthouse/stargazers"
        data-show-count="true"
        data-count-aria-label="# stargazers on GitHub"
        aria-label="Star this project on GitHub">
            Star
            </a>
            </div>
            </section>

            <section className="copyright">{this.props.config.copyright}</section>
        </footer>
    );
    }
}

module.exports = Footer;
