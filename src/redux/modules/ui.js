export const types = {
    TOGGLE_TOOLBAR: 'TOGGLE_TOOLBAR',
    TOGGLE_BACKLOG: 'TOGGLE_BACKLOG',
    RESTORE_INITIAL_STATE: 'RESTORE_INITIAL_STATE',
};

const initialState = {
    showToolbar: false,
    showBacklog: false,
};

export const reducer = (state = initialState, action) => {
    switch (action.type) {
        case types.TOGGLE_TOOLBAR:
            // If we toggle the toolbar, we also close the backlog.
            const next = !state.showToolbar;
            if (next) {
                return { ...state, showToolbar: next };
            } else {
                return { ...state, showBacklog: false, showToolbar: next };
            }
        case types.TOGGLE_BACKLOG:
            return { ...state, showBacklog: !state.showBacklog };
        case types.RESTORE_INITIAL_STATE:
            return initialState;
        default:
            return state;
    }
};

export const actions = {
    toggleToolbar: () => ({ type: types.TOGGLE_TOOLBAR }),
    toggleBacklog: () => ({ type: types.TOGGLE_BACKLOG }),
    restoreInitialState: () => ({ type: types.RESTORE_INITIAL_STATE }),
};
