const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;

class Demo extends React.Component {
    render() {


        return (

            <div className="mainContainer" style={{height: '100%', minHeight: '700px', position: 'relative'}}>
                <iframe src="https://stackblitz.com/github/alberthaff/ngx-buoy-demo?embed=1&file=src/app/home/home.component.ts" style={{height: '100%', width: '100%', display: 'block', position: 'absolute', top: 0, left: 0}} />
            </div>
        );
    }
}

module.exports = Demo;
