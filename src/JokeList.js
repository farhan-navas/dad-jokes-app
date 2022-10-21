import React, { Component } from 'react'
import axios from 'axios'
import Joke from './Joke'
import { v4 as uuidv4 } from 'uuid';
import './JokeList.css'

export default class JokeList extends Component {
    static defaultProps = {
        numJokesToGet: 10 
    }
    
    constructor(props) {
        super(props);
        this.state = { 
            jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
            loading: false 
        }
        this.getJokes = this.getJokes.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.seenJokes = new Set(this.state.jokes.map(j => j.text))
    }

    componentDidMount() {
        if (this.state.jokes.length === 0) {
            this.setState({ loading: true })
            this.getJokes()
        }
    }

    async getJokes() {
        try {
            let jokes = []
            while (jokes.length < this.props.numJokesToGet) {
                let res = await axios.get('https://icanhazdadjoke.com/', {
                    headers: { Accept: 'application/json'}
                })
                let newJoke = res.data.joke
                if (!this.seenJokes.has(newJoke)) {
                    jokes.push({ text: res.data.joke, votes: 0, id: uuidv4() })
                } else {
                    console.log('FOUND DUPLICATE')
                }
            }
            this.setState(st => ({
                jokes: [...st.jokes, ...jokes],
                loading: false
            }),
            () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
            )  
        } catch(e) {
            alert(e)
            this.setState({ loading: false })
        }
    }

    handleVote(id, delta) {
        this.setState(st => ({
            jokes: st.jokes.map(j => {
                return ( j.id === id ? {...j, votes: j.votes + delta} : j ) 
            }) 
        }),
        () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        )
    }
    
    handleClick() {
        this.setState({ loading: true})
        this.getJokes();
    }

    render() {
        let jokes = this.state.jokes.sort((a, b) => b.votes - a.votes)

        let jokeList = jokes.map(j => {
            return (
                <Joke 
                    votes={j.votes} 
                    text={j.text}
                    key={j.id}
                    id={j.id}
                    upvote={() => this.handleVote(j.id, 1)}
                    downvote={() => this.handleVote(j.id, -1)}
                />
            )
        })
        if (this.state.loading) {
            return (
                <div className='spinner'>
                    <i className='far fa-8x fa-laugh fa-spin' />
                    <h1 className='JokeList-title'>LOADING...</h1>
                </div>
            )
        }
        else {
            return (
                <div className='JokeList'>
                    <div className='JokeList-sidebar'>
                        <h1 className='JokeList-title'><span>Dad</span> Jokes</h1>
                        <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' alt='laughing emoji'/>
                        <button onClick={this.handleClick}>NEW JOKES</button>
                    </div>
                    <div className='JokeList-jokes'>
                        {jokeList}
                    </div>
                </div>
            )
        }        
    }
}
