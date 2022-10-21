import React, { Component } from 'react'
import './Joke.css'

export default class Joke extends Component {
    constructor(props) {
        super(props)
        this.getColor = this.getColor.bind(this)
    }

    getColor() {
        if (this.props.votes >= 15) {
            return "#02f50b"
        } else if (this.props.votes >= 12) {
            return "#92fc96"
        } else if (this.props.votes >= 9) {
            return "yellow"
        } else if (this.props.votes >= 6) {
            return "lightorange"
        } else if (this.props.votes >= 3) {
            return "orange"
        } else {
            return "red"
        }
    }
    
    render() {
        return (
            <div className='Joke'>
                <div className='Joke-buttons'>
                    <i onClick={this.props.upvote} className="fa-solid fa-arrow-up"></i>
                    <span className='Joke-votes' style={{ border: `2px solid ${this.getColor()}`}}>{this.props.votes}</span>
                    <i onClick={this.props.downvote} className="fa-solid fa-arrow-down"></i>
                </div>
                <div className='Joke-text'>
                    {this.props.text}
                </div>
                <div>
                    <i className="fa-regular fa-face-laugh-squint"></i>
                </div>
            </div>
        )
    }
}