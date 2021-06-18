import React, { useState, useEffect } from 'react';
import { AddCircle, CloseCircle, Save, ArrowForward, Create } from 'react-ionicons'

function App() {
    const [notes, setNotes] = useState([]);
    const [noteSelected, setNoteSelected] = useState('');

    useEffect(() => {
        fetchNotes();
    }, []);

    async function fetchNotes() {
        console.log("Fetching notes...");
        const response = await fetch('http://localhost:3001/api/v1/notes', { 
            headers: {
                'Accept': 'application/json'
            }
        });
        const json = await response.json();

        console.log(json);  
        setNotes(json);
    }

    function updateModifyDate(note) {
        let copyOfStateObj = {};
        copyOfStateObj = Object.assign(copyOfStateObj, note);
        copyOfStateObj.updatedDate = note.updatedDate
        
        let indexToReplace = notes.findIndex((noteFromState) => 
            noteFromState._id === copyOfStateObj._id
        );

        const copyOfStateArray = [...notes];
        copyOfStateArray[indexToReplace] = copyOfStateObj

        setNotes(copyOfStateArray);
    }

    function handleInput(e, note, type) {
        let copyOfStateObj = {};
        copyOfStateObj = Object.assign(copyOfStateObj, note);

        if(type.toLowerCase() === 'title')
            copyOfStateObj.title = e.target.value;
        else if(type.toLowerCase() === 'content') {
            copyOfStateObj.content = e.target.value;
        }
        
        let indexToReplace = notes.findIndex((noteFromState) => 
            noteFromState._id === copyOfStateObj._id
        );

        const copyOfStateArray = [...notes];
        copyOfStateArray[indexToReplace] = copyOfStateObj

        setNotes(copyOfStateArray);
    }

    async function handleSave(note) {
        if(note._id !== noteSelected) return;

        let { _id, updatedDate, creationDate, ...updates } = note;
        console.log(note);
        console.log(updates);

        const response = await fetch('http://localhost:3001/api/v1/notes/'+note._id, { 
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        const json = await response.json();
        updateModifyDate(json);
        console.log('Saved note ' + JSON.stringify(json, null, 4));
    }

    async function removeNote(note) {
        if(note._id !== noteSelected) return;

        await fetch('http://localhost:3001/api/v1/notes/'+note._id, { 
            method: 'DELETE'
        });
        let indexToReplace = notes.findIndex((noteFromState) => 
            noteFromState._id === note._id
        );

        let oldNotes = [...notes];
        oldNotes.splice(indexToReplace, 1);
        console.log(oldNotes);

        setNotes(oldNotes);

        console.log('Removed note ' + note._id);
    }

    async function addNote() {
        let newNote = {
            title: "Title",
            content: "Content"
        }
        const response = await fetch('http://localhost:3001/api/v1/notes', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newNote)
        });
        const json = await response.json();

        newNote = json;
        setNotes(oldNotes => [newNote, ...oldNotes]);
        setNoteSelected(newNote._id);
    }

    return (
        <div className="App">
            <h1 className="title">Note Taker 1.0</h1>
            <div className="button-area">
                <AddCircle
                    color={'rgb(253, 253, 253);'} 
                    title="add a note"
                    height="45px"
                    width="45px"
                    cssClasses="add"
                    onClick={addNote}
                />
            </div>
            <ul className="notes-list">
                {notes.map(note => (
                    <li 
                    key={note._id} 
                    id={note._id} 
                    className={note._id === noteSelected ? "note note-selected no-pointer" : "note"}>
                        <div className="note-main">
                            <div className="note-top">
                                <input 
                                className="note-title" 
                                type="text" 
                                defaultValue={note.title}
                                onKeyPress={ e => { handleInput(e, note, 'title') }}
                                />
                                <Save
                                color={'#00000'}
                                height="25px"
                                width="25px"
                                title="Save"
                                cssClasses="save"
                                onClick={() => { handleSave(note) }}
                                />
                                <CloseCircle
                                color={'#00000'}
                                height="25px"
                                width="25px"
                                title="Delete"
                                cssClasses="delete" 
                                onClick={() => {removeNote(note)}}
                                />
                                <ArrowForward
                                color={'#00000'} 
                                height="25px"
                                width="25px"
                                title="Back"
                                cssClasses="back"
                                onClick={ () => {setNoteSelected("")} }
                                />
                            </div>
                            <textarea 
                            className="note-content" 
                            defaultValue={note.content}
                            onKeyPress={ e => { handleInput(e, note, 'content') }}
                            />
                        </div>
                        <div className="note-footer">
                            <p className="note-created">
                                Created {new Date(note.creationDate).toLocaleString()}
                            </p>
                            <p className="note-updated">
                                Last modified {new Date(note.updatedDate).toLocaleString()}
                            </p>
                            <Create
                            color={'#00000'} 
                            height="35px"
                            width="35px"
                            title="Edit"
                            cssClasses="edit"
                            onClick={ () => {setNoteSelected(note._id)} }
                            />
                        </div>
                    </li> 
                ))}
            </ul>
        </div>
    );
}

export default App;
