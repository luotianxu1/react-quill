import React, { Component } from 'react'
import Editor from './components/Editor/Editor'
import './App.css'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            content: '',
        }
    }

    handleEditorChange = (content) => {
        this.setState({ content })
    }

    render() {
        return (
            <div className='App'>
                <Editor onChange={this.handleEditorChange} />
            </div>
        )
    }
}

export default App
