import React from 'react';


class GameListComponent extends React.Component<{greeting: string}, {date: Date}> {
    timerID: number = 0;

    constructor(props: Readonly<any>){
        super(props);
        this.state = {date: new Date()};
    }

    componentDidMount() {
        this.timerID = window.setInterval(() => this.tick(), 1000);
    }

    componentWillMount() {
        clearInterval(this.timerID);
    }

    tick(): void {
        this.setState({
            date: new Date()
        });
    }

    render() {
        return (
            <div>
                <h2>game list component dd dd{this.state.date.toLocaleDateString()}</h2>
            </div>
        );
    }
}

export default GameListComponent;