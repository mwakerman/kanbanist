import React from 'react';

export default () => (
    <div className="page">
        <div className="page-content Donate">
            <h2 className="font-roboto">Thanks!</h2>
            <hr />
            <p>
                I used Todoist and wanted something like Trello's Kanban UI to manage and track my tasks and had given
                up on Todoist releasing <a href="https://blog.todoist.com/2016/02/04/boards-todoist-kanban/">Boards</a>
                &nbsp; for a platform other than Windows 10. And so <strike>
                    Todollo
                </strike> <strike>Trelloist</strike> Kanbanist was born. I hope it's something that you find useful too
                and feel free to send through any &nbsp;
                <a href="mailto:m.wakerman+trelloistbug@gmail.com?subject=I%20found%20a%20bug%20with%20Trelloist">
                    bug reports
                </a>{' '}
                or &nbsp;
                <a href="mailto:m.wakerman+trelloistfeature@gmail.com?subject=A%20feature%20request%20for%20Trelloist">
                    feature requests
                </a>
                .
            </p>
            <hr />
            <h6>PayPal</h6>
            <p>
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                    <input type="hidden" name="cmd" value="_s-xclick" />
                    <input
                        type="hidden"
                        name="encrypted"
                        value="-----BEGIN PKCS7-----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-----END PKCS7-----"
                    />
                    <input
                        type="image"
                        src="https://www.paypalobjects.com/en_AU/i/btn/btn_donate_LG.gif"
                        name="submit"
                        alt="PayPal – The safer, easier way to pay online!"
                    />
                    <img alt="" src="https://www.paypalobjects.com/en_AU/i/scr/pixel.gif" width="1" height="1" />
                </form>
            </p>
            <hr />
            <h6>Other ways to support Trelloist</h6>
            <ul>
                <li>
                    <a
                        href="https://twitter.com/home?status=Checkout Trelloist: a kanban board for Todoist https://trelloist.com"
                        target="_blank"
                        rel="noopener noreferrer">
                        Tweet support!
                    </a>
                </li>
            </ul>
        </div>
    </div>
);
