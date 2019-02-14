const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;

class Demo extends React.Component {
    render() {


        return (

            <div className="mainContainer" style={{height: '100%', minHeight: '700px', position: 'relative'}}>
                <iframe src="https://stackblitz.com/edit/ngx-buoy-demo?embed=1&file=src/app/app.component.html,src/app/app.component.ts&hideNavigation=1" style={{height: '100%', width: '100%', display: 'block', position: 'absolute', top: 0, left: 0}} />
            </div>
        );
    }
}

module.exports = Demo;
