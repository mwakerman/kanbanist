import React from 'react';

export default () => {
    return (
        <div className="page">
            <div className="page-content Home">
                <h2>Kanbanist Demo Video</h2>
                <hr />
                <div className="video-wrapper">
                    <iframe
                        title="kanbanist demo"
                        width="560"
                        height="315"
                        src="https://www.youtube.com/embed/Y5rbyNZuFBQ"
                        frameBorder="0"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
};
