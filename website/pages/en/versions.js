/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;

class Versions extends React.Component {
    render() {
        return (
            <div className="mainContainer">
                <Container padding={['bottom', 'top']}>
                    <div className="showcaseSection">
                        <div className="prose">
                            <h1>Versions</h1>
                        </div>
                    </div>
                </Container>
            </div>
        );
    }
}

module.exports = Versions;
