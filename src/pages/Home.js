import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Intent } from '@blueprintjs/core';

import kanbanistImg from './kanbanist.png';

export default () => (
    <div className="page">
        <div className="page-content Home">
            <h2>Welcome to Kanbanist</h2>
            <p>
                <em>The missing Kanban board for Todoist</em>
            </p>
            <hr />
            <img src={kanbanistImg} alt="screenshot" style={{ width: '100%' }} />
            <ul className="home-paragraph" style={{ lineHeight: '1.6em', listStyle: 'none' }}>
                <li>
                    <span role="img" aria-label="filter">
                        🛠
                    </span>{' '}
                    Use filters to craft the perfect board
                </li>
                <li>
                    <span role="img" aria-label="bookmark">
                        📖
                    </span>{' '}
                    Bookmark your favourite boards
                </li>
                <li>
                    <span role="img" aria-label="quick add">
                        ⚡️
                    </span>{' '}
                    Use quick-add syntax to create tasks in #projects, with due dates and (p)riorities
                </li>
                <li>
                    <span role="img" aria-label="privacy">
                        🔐
                    </span>{' '}
                    Kanbanist talks only to Todoist, so your tasks stay completely <strong>private</strong>
                </li>
                <li>
                    <span role="img" aria-label="open source">
                        🙌
                    </span>{' '}
                    Open Source: checkout the{' '}
                    <a href="https://github.com/mwakerman/kanbanist" target="_blank" rel="noopener noreferrer">
                        project on github
                    </a>.
                </li>
            </ul>
            <p style={{ width: '100%', margin: '20px auto', textAlign: 'center' }}>
                <Link className="Home-Button" to="/board">
                    <Button className=" bp3-large" intent={Intent.SUCCESS} text="Get Started" />
                </Link>
                <Link className="Home-Button" to="/demo">
                    <Button className="bp3-large" intent={Intent.WARNING} text="Demo Video" />
                </Link>
            </p>
        </div>
    </div>
);
