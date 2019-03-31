import React from 'react';

export default () => (
    <div className="page">
        <div className="page-content Issues">
            <h2>Known Issues</h2>
            <p>
                This page lists known issues with Kanbanist, please read before sending a Bug or Feature Request email.
            </p>
            <hr />
            <h4>ISSUE 01: Ordering items within a list.</h4>
            <p>
                The Todoist API does not current allow for custom ordering of items within labels (as it does for
                projects). I submitted a feature request with Todoist and got the following response:{' '}
                <em>
                    "We might look at doing something about that later, but currently we don't have the resources
                    unfortunately, sorry about that."
                </em>
                .
            </p>
            <h4>ISSUE 04: General support for Todoist Filters</h4>
            <p>
                I've received a number of requests for supporting Todoist Filters in various ways. Most commonly to
                allow a filter to be applied to the entire board. I contacted Todoist support to ask about the endpoint
                and they responded that the Todoist Filters API endpoint is not currently working (which is why it's
                been removed from the developer documentation) but they will notify when/if it is fixed. Currently
                Todoist Filters are applied by each application client rather than the server which would be a huge
                amount of work to support in Kanbanist.
            </p>
        </div>
    </div>
);
